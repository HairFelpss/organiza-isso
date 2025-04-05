import { Injectable } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateNotificationDto): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        message: data.message,
        deliveredAt: data.deliveredAt ?? null,
      },
    });
  }

  findAll() {
    return this.prisma.notification.findMany({
      include: { user: true },
    });
  }

  findById(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  update(id: string, data: UpdateNotificationDto) {
    return this.prisma.notification.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
