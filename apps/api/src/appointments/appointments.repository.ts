import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAppointmentDto, userId: string) {
    return this.prisma.appointment.create({
      data: {
        clientId: userId,
        professionalId: data.professionalId,
        scheduleId: data.scheduleId,
        status: data.status ?? 'PENDING',
      },
    });
  }

  findAllByUser(userId: string) {
    return this.prisma.appointment.findMany({
      where: { clientId: userId },
      include: { professional: true, schedule: true },
    });
  }

  findById(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: { professional: true, schedule: true },
    });
  }

  update(id: string, data: UpdateAppointmentDto) {
    return this.prisma.appointment.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.appointment.delete({
      where: { id },
    });
  }
}
