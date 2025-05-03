import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalsQueryDto } from './schemas/professionals-query.schema';

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

  async findAll(params?: ProfessionalsQueryDto) {
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
        calendars: {
          select: {
            id: true,
            name: true,
            type: true,
            events: {
              where: {
                startTime: {
                  gte: new Date(),
                },
              },
              orderBy: {
                startTime: 'asc',
              },
            },
          },
        },
      },
    });
  }

  findByUserId(userId: string) {
    return this.prisma.professional.findUnique({
      where: { userId },
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
        calendars: {
          select: {
            id: true,
            name: true,
            type: true,
            events: {
              where: {
                startTime: {
                  gte: new Date(),
                },
              },
              orderBy: {
                startTime: 'asc',
              },
            },
          },
        },
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
