import { Injectable } from '@nestjs/common';
import { AppointmentStatus, Plan, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';

@Injectable()
export class ProfessionalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateProfessionalDto, userId: string) {
    const professionalData: Prisma.ProfessionalCreateInput = {
      user: {
        connect: { id: userId },
      },
      businessName: data.businessName,
      specialties: data.specialties,
      profileDescription: data.profileDescription,
      subscriptionPlan: data.subscriptionPlan || 'FREE',
      isActive: data.isActive ?? true,
      ...(data.companyId && {
        company: {
          connect: { id: data.companyId },
        },
      }),
    };

    return this.prisma.professional.create({
      data: professionalData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            document: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(params?: {
    search?: string;
    specialties?: string[];
    isActive?: boolean;
    companyId?: string;
    subscriptionPlan?: Plan;
    minRating?: number;
    page?: number;
    limit?: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
  }) {
    const {
      search,
      specialties,
      isActive,
      companyId,
      subscriptionPlan,
      minRating,
      page = 1,
      limit = 10,
      orderBy = 'createdAt',
      order = 'desc',
    } = params || {};

    const where: Prisma.ProfessionalWhereInput = {
      ...(search && {
        OR: [
          { businessName: { contains: search, mode: 'insensitive' } },
          { profileDescription: { contains: search, mode: 'insensitive' } },
          { user: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
      ...(specialties?.length && {
        specialties: { hasEvery: specialties },
      }),
      ...(typeof isActive === 'boolean' && { isActive }),
      ...(companyId && { companyId }),
      ...(subscriptionPlan && { subscriptionPlan }),
      ...(typeof minRating === 'number' && {
        averageRating: { gte: minRating },
      }),
    };

    const [total, professionals] = await Promise.all([
      this.prisma.professional.count({ where }),
      this.prisma.professional.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [orderBy]: order },
      }),
    ]);

    return {
      professionals,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findById(id: string) {
    return this.prisma.professional.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });
  }

  findByUserId(userId: string) {
    return this.prisma.professional.findUnique({
      where: { userId },
    });
  }

  findWithUser(id: string) {
    return this.prisma.professional.findUnique({
      where: { id },
      include: {
        user: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  findWithDetails(id: string) {
    return this.prisma.professional.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            document: true,
            role: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        Calendar: {
          select: {
            id: true,
            blocks: {
              where: {
                dateTime: {
                  gte: new Date(),
                },
              },
              orderBy: {
                dateTime: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async findSchedule(
    professionalId: string,
    params?: {
      startDate?: Date;
      endDate?: Date;
      isAvailable?: boolean;
    },
  ) {
    const { startDate, endDate, isAvailable } = params || {};

    return this.prisma.calendarBlock.findMany({
      where: {
        calendar: {
          professionalId,
        },
        ...(typeof isAvailable === 'boolean' && { isAvailable }),
        ...(startDate && {
          dateTime: {
            gte: startDate,
            ...(endDate && { lte: endDate }),
          },
        }),
      },
      include: {
        appointment: {
          select: {
            id: true,
            status: true,
            client: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        dateTime: 'asc',
      },
    });
  }

  async findRatings(
    professionalId: string,
    params?: {
      page?: number;
      limit?: number;
      minScore?: number;
      maxScore?: number;
      orderBy?: string;
      order?: 'asc' | 'desc';
    },
  ) {
    const {
      page = 1,
      limit = 10,
      minScore,
      maxScore,
      orderBy = 'createdAt',
      order = 'desc',
    } = params || {};

    const where: Prisma.AppointmentWhereInput = {
      professionalId,
      status: 'CONFIRMED',
      rating: {
        score: {
          ...(typeof minScore === 'number' && { gte: minScore }),
          ...(typeof maxScore === 'number' && { lte: maxScore }),
        },
      },
    };

    const [total, ratings] = await Promise.all([
      this.prisma.appointment.count({ where }),
      this.prisma.appointment.findMany({
        where,
        select: {
          rating: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [orderBy]: order },
      }),
    ]);

    return {
      ratings,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findCompanyById(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
    });
  }

  async getProfessionalStats(professionalId: string) {
    const [appointments, ratings] = await Promise.all([
      this.prisma.appointment.count({
        where: { professionalId },
      }),
      this.prisma.appointment.findMany({
        where: {
          professionalId,
          rating: { isNot: null },
        },
        select: {
          rating: {
            select: {
              score: true,
            },
          },
        },
      }),
    ]);

    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? ratings.reduce((acc, curr) => acc + curr.rating!.score, 0) /
          totalRatings
        : 0;

    return {
      totalAppointments: appointments,
      totalRatings,
      averageRating,
    };
  }

  async findUpcomingAppointments(
    professionalId: string,
    params: {
      status?: AppointmentStatus;
      limit?: number;
    },
  ) {
    const { status, limit = 5 } = params;

    const appointments = await this.prisma.appointment.findMany({
      where: {
        professionalId,
        ...(status && { status }),
        calendarBlock: {
          dateTime: {
            gte: new Date(),
          },
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
        calendarBlock: true,
      },
      orderBy: {
        calendarBlock: {
          dateTime: 'asc',
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

  async update(id: string, data: UpdateProfessionalDto) {
    const updateData: Prisma.ProfessionalUpdateInput = {
      businessName: data.businessName,
      specialties: data.specialties,
      profileDescription: data.profileDescription,
      subscriptionPlan: data.subscriptionPlan,
      isActive: data.isActive,
      ...(data.companyId && {
        company: {
          connect: { id: data.companyId },
        },
      }),
    };

    return this.prisma.professional.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  delete(id: string) {
    return this.prisma.professional.delete({
      where: { id },
    });
  }

  // Métodos de Calendário
  async createCalendar(professionalId: string) {
    return this.prisma.calendar.create({
      data: {
        professional: {
          connect: { id: professionalId },
        },
      },
    });
  }

  async addCalendarBlock(
    professionalId: string,
    data: {
      dateTime: Date;
      duration: number;
      isAvailable: boolean;
      reason?: string;
    },
  ) {
    // Primeiro, encontramos o calendário do profissional
    const calendar = await this.prisma.calendar.findFirst({
      where: {
        professionalId,
      },
    });

    if (!calendar) {
      // Se não existir um calendário, criamos um novo
      const newCalendar = await this.prisma.calendar.create({
        data: {
          professional: {
            connect: { id: professionalId },
          },
        },
      });

      // Criamos o bloco no novo calendário
      return this.prisma.calendarBlock.create({
        data: {
          ...data,
          calendar: {
            connect: { id: newCalendar.id },
          },
        },
        include: {
          calendar: {
            include: {
              professional: {
                select: {
                  id: true,
                  businessName: true,
                },
              },
            },
          },
        },
      });
    }

    // Se já existir um calendário, criamos o bloco nele
    return this.prisma.calendarBlock.create({
      data: {
        ...data,
        calendar: {
          connect: { id: calendar.id },
        },
      },
      include: {
        calendar: {
          include: {
            professional: {
              select: {
                id: true,
                businessName: true,
              },
            },
          },
        },
      },
    });
  }

  async checkTimeConflict(
    professionalId: string,
    dateTime: Date,
    duration: number,
  ): Promise<boolean> {
    const endTime = new Date(dateTime.getTime() + duration * 60000); // duration em minutos

    const existingBlock = await this.prisma.calendarBlock.findFirst({
      where: {
        calendar: {
          professionalId,
        },
        dateTime: {
          lte: endTime,
        },
        AND: {
          dateTime: {
            gte: dateTime,
          },
        },
      },
    });

    return !!existingBlock;
  }

  async addCalendarBlocks(
    professionalId: string,
    blocks: Array<{
      dateTime: Date;
      duration: number;
      isAvailable: boolean;
      reason?: string;
    }>,
  ) {
    // Encontra ou cria o calendário
    const calendar =
      (await this.prisma.calendar.findFirst({
        where: { professionalId },
      })) ||
      (await this.prisma.calendar.create({
        data: {
          professional: {
            connect: { id: professionalId },
          },
        },
      }));

    // Cria todos os blocos em uma única transação
    return this.prisma.$transaction(
      blocks.map((block) =>
        this.prisma.calendarBlock.create({
          data: {
            ...block,
            calendar: {
              connect: { id: calendar.id },
            },
          },
        }),
      ),
    );
  }

  async updateCalendarBlock(
    blockId: string,
    data: {
      dateTime?: Date;
      duration?: number;
      isAvailable?: boolean;
      reason?: string;
    },
  ) {
    return this.prisma.calendarBlock.update({
      where: { id: blockId },
      data,
      include: {
        calendar: {
          include: {
            professional: {
              select: {
                id: true,
                businessName: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteCalendarBlock(blockId: string) {
    return this.prisma.calendarBlock.delete({
      where: { id: blockId },
    });
  }

  async cleanOldBlocks(professionalId: string, beforeDate: Date) {
    return this.prisma.calendarBlock.deleteMany({
      where: {
        calendar: {
          professionalId,
        },
        dateTime: {
          lt: beforeDate,
        },
        appointment: null, // Só deleta se não tiver agendamento
      },
    });
  }

  // Métodos de Agendamento
  updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
  }

  async findAppointmentsByProfessionalId(
    professionalId: string,
    params?: {
      status?: AppointmentStatus;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    },
  ) {
    const { status, startDate, endDate, page = 1, limit = 10 } = params || {};

    const where: Prisma.AppointmentWhereInput = {
      professionalId,
      ...(status && { status }),
      ...((startDate || endDate) && {
        calendarBlock: {
          dateTime: {
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
          calendarBlock: true,
          rating: true,
        },
        orderBy: {
          calendarBlock: {
            dateTime: 'desc',
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

  async findRatingsByProfessionalId(
    professionalId: string,
    params?: {
      minScore?: number;
      maxScore?: number;
      page?: number;
      limit?: number;
    },
  ) {
    const { minScore, maxScore, page = 1, limit = 10 } = params || {};

    const where: Prisma.AppointmentWhereInput = {
      professionalId,
      status: 'CONFIRMED',
      rating: {
        score: {
          ...(typeof minScore === 'number' && { gte: minScore }),
          ...(typeof maxScore === 'number' && { lte: maxScore }),
        },
      },
    };

    const [total, appointments] = await Promise.all([
      this.prisma.appointment.count({ where }),
      this.prisma.appointment.findMany({
        where,
        select: {
          id: true,
          rating: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          calendarBlock: {
            select: {
              dateTime: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      ratings: appointments.map((appointment) => ({
        id: appointment.rating!.id,
        appointmentId: appointment.id,
        score: appointment.rating!.score,
        comment: appointment.rating!.comment,
        clientName: appointment.client.name,
        appointmentDate: appointment.calendarBlock.dateTime,
        createdAt: appointment.createdAt,
      })),
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAppointments(
    professionalId: string,
    params?: {
      status?: AppointmentStatus;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    },
  ) {
    const { status, startDate, endDate, page = 1, limit = 10 } = params || {};

    const where: Prisma.AppointmentWhereInput = {
      professionalId,
      ...(status && { status }),
      ...((startDate || endDate) && {
        calendarBlock: {
          dateTime: {
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
          calendarBlock: true,
          rating: true,
          assignedProfessionals: {
            include: {
              professional: {
                select: {
                  id: true,
                  businessName: true,
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          calendarBlock: {
            dateTime: 'desc',
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

  // Método auxiliar para atualizar estatísticas do profissional
  async updateProfessionalStats(professionalId: string) {
    const [totalAppointments, ratings] = await Promise.all([
      this.prisma.appointment.count({
        where: { professionalId },
      }),
      this.prisma.appointment.findMany({
        where: {
          professionalId,
          rating: { isNot: null },
        },
        select: {
          rating: {
            select: {
              score: true,
            },
          },
        },
      }),
    ]);

    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? ratings.reduce((acc, curr) => acc + curr.rating!.score, 0) /
          totalRatings
        : 0;

    return this.prisma.professional.update({
      where: { id: professionalId },
      data: {
        totalAppointments,
        totalRatings,
        averageRating,
      },
    });
  }
}
