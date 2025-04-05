import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';

@Injectable()
export class ProfessionalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateProfessionalDto, userId: string) {
    return this.prisma.professional.create({
      data: {
        ...data,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  findAll() {
    return this.prisma.professional.findMany({
      include: { user: true },
    });
  }

  findById(id: string) {
    return this.prisma.professional.findUnique({
      where: { id },
    });
  }

  findWithUser(id: string) {
    return this.prisma.professional.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  findScheduleByProfessionalId(professionalId: string) {
    return this.prisma.schedule.findMany({
      where: {
        providerId: professionalId,
        isAvailable: true,
      },
      orderBy: {
        dateTime: 'asc',
      },
    });
  }

  findRatingsByProfessionalId(professionalId: string) {
    return this.prisma.appointment.findMany({
      where: {
        providerId: professionalId,
        status: 'CONFIRMED',
        NOT: { rating: null },
      },
      select: {
        rating: true,
        client: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  update(id: string, data: UpdateProfessionalDto) {
    return this.prisma.professional.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.professional.delete({
      where: { id },
    });
  }
}
