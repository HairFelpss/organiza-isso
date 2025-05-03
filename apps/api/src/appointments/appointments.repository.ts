import { Injectable } from '@nestjs/common';
import { AppointmentStatus } from '@organiza-isso-app/zod';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentsQueryDto } from './schemas/appointments-query.schema';

@Injectable()
export class AppointmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAppointmentDto, userId: string) {
    return this.prisma.appointment.create({
      data: {
        clientId: userId,
        professionalId: data.professionalId,
        calendarEventId: data.calendarEventId,
        status: data.status ?? 'PENDING',
      },
    });
  }

  findById(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        professional: true,
        calendarEvent: {
          // Mudado de calendarBlock
          include: {
            calendar: true,
          },
        },
      },
    });
  }

  async findAllAppointmentsByUserId(
    userId: string,
    params?: AppointmentsQueryDto,
  ) {
    const { status, startDate, endDate, page = 1, limit = 10 } = params || {};

    const where: Prisma.AppointmentWhereInput = {
      clientId: userId,
      ...(status && { status }),
      ...((startDate || endDate) && {
        calendarEvent: {
          // Mudado de calendarBlock
          startTime: {
            // Mudado de dateTime
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          },
        },
      }),
    };

    const [total, appointments] = await Promise.all([
      this.prisma.appointment.count({ where }),
      this.prisma.appointment.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          calendarEvent: true, // Mudado de calendarBlock
          rating: true,
        },
        orderBy: {
          calendarEvent: {
            // Mudado de calendarBlock
            startTime: 'desc', // Mudado de dateTime
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      appointments,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllAppointmentsByProfessionalId(
    professionalId: string,
    params?: AppointmentsQueryDto,
  ) {
    const { status, startDate, endDate, page = 1, limit = 10 } = params || {};

    const where: Prisma.AppointmentWhereInput = {
      professionalId,
      ...(status && { status }),
      ...((startDate || endDate) && {
        calendarEvent: {
          // Mudado de calendarBlock
          startTime: {
            // Mudado de dateTime
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          },
        },
      }),
    };

    const [total, appointments] = await Promise.all([
      this.prisma.appointment.count({ where }),
      this.prisma.appointment.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          calendarEvent: true, // Mudado de calendarBlock
          rating: true,
        },
        orderBy: {
          calendarEvent: {
            // Mudado de calendarBlock
            startTime: 'desc', // Mudado de dateTime
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      appointments,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

  updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
  }

  async findUpcomingAppointments(
    professionalId: string,
    params: AppointmentsQueryDto,
  ) {
    const { status, limit = 5 } = params;

    const appointments = await this.prisma.appointment.findMany({
      where: {
        professionalId,
        ...(status && { status }),
        calendarEvent: {
          // Mudado de calendarBlock
          startTime: {
            // Mudado de dateTime
            gte: new Date(),
          },
          eventType: 'APPOINTMENT', // Novo: garante que só pega eventos do tipo appointment
        },
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        calendarEvent: true, // Mudado de calendarBlock
      },
      orderBy: {
        calendarEvent: {
          // Mudado de calendarBlock
          startTime: 'asc', // Mudado de dateTime
        },
      },
      take: limit,
    });

    return {
      appointments,
      metadata: {
        total: appointments.length,
        limit,
      },
    };
  }
}
