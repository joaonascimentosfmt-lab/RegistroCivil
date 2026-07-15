import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private refreshTokens: Map<string, { userId: string; email: string; expiresAt: Date }> = new Map();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo. Contate o administrador');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('Usuário foi removido do sistema');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const permissions = user.role.permissions;
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken(user.id, user.email);

    this.logger.log(`Login successful for user ${user.email}`);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
        permissions,
        serventia: user.serventia,
      },
    };
  }

  async refresh(refreshToken: string) {
    const stored = this.refreshTokens.get(refreshToken);
    if (!stored) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (new Date() > stored.expiresAt) {
      this.refreshTokens.delete(refreshToken);
      throw new UnauthorizedException('Refresh token expirado');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: stored.userId },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      this.refreshTokens.delete(refreshToken);
      throw new UnauthorizedException('Usuário não encontrado ou inativo');
    }

    this.refreshTokens.delete(refreshToken);

    const permissions = user.role.permissions;
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
      permissions,
    };

    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.generateRefreshToken(user.id, user.email);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    this.refreshTokens.delete(refreshToken);
    return { message: 'Logout realizado com sucesso' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      permissions: user.role.permissions,
      serventia: user.serventia,
      createdAt: user.createdAt,
    };
  }

  private generateRefreshToken(userId: string, email: string): string {
    const token = uuidv4();
    const expiresIn = process.env.JWT_REFRESH_EXPIRATION || '7d';
    const days = parseInt(expiresIn) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    this.refreshTokens.set(token, { userId, email, expiresAt });
    return token;
  }
}
