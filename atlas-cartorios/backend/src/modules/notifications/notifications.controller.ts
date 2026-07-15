import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notificações')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificações do usuário' })
  async findByUser(
    @CurrentUser() user: any,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const onlyUnread = unreadOnly === 'true';
    return this.notificationsService.findByUser(user.id, onlyUnread);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Quantidade de notificações não lidas' })
  async getUnreadCount(@CurrentUser() user: any) {
    return {
      count: await this.notificationsService.getUnreadCount(user.id),
    };
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    await this.notificationsService.markAsRead(id, user.id);
    return { message: 'Notificação marcada como lida' };
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Marcar todas notificações como lidas' })
  async markAllAsRead(@CurrentUser() user: any) {
    await this.notificationsService.markAllAsRead(user.id);
    return { message: 'Todas notificações marcadas como lidas' };
  }
}
