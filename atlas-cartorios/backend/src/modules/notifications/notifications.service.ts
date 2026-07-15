import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string, unreadOnly = false) {
    const where: any = { userId };

    if (unreadOnly) {
      where.read = false;
    }

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, read: false },
    });
  }

  async create(data: {
    userId: string;
    title: string;
    message: string;
    type: string;
    link?: string;
  }) {
    return this.prisma.notification.create({ data });
  }

  async createForProtocol(protocolId: string, type: string, title: string, message: string) {
    const protocol = await this.prisma.protocol.findUnique({
      where: { id: protocolId },
      select: { escreventeId: true },
    });

    if (!protocol || !protocol.escreventeId) return null;

    return this.create({
      userId: protocol.escreventeId,
      title,
      message,
      type,
      link: `/protocols/${protocolId}`,
    });
  }
}
