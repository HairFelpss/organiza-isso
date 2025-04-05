import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(private readonly repository: NotificationsRepository) {}

  create(dto: CreateNotificationDto) {
    if (!dto.userId) throw new NotFoundException('Usuário não encontrado');

    if (!dto.type)
      throw new NotFoundException('Tipo de notificação não encontrado');

    if (!dto.message) throw new NotFoundException('Mensagem não encontrada');

    if (!dto.deliveredAt)
      throw new NotFoundException('Data de entrega não encontrada');

    return this.repository.create(dto);
  }

  findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const notification = await this.repository.findById(id);
    if (!notification)
      throw new NotFoundException('Notificação não encontrada');
    return notification;
  }

  async update(id: string, dto: UpdateNotificationDto) {
    await this.findOne(id); // valida existência
    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id); // valida existência
    return this.repository.delete(id);
  }
}
