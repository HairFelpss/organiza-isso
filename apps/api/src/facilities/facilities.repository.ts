import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';

@Injectable()
export class FacilitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateFacilityDto) {
    return this.prisma.facility.create({
      data,
      include: {
        establishment: true,
        professionals: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.facility.findUnique({
      where: { id },
      include: {
        establishment: true,
        professionals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  findByEstablishmentId(establishmentId: string) {
    return this.prisma.facility.findMany({
      where: { establishmentId },
      include: {
        professionals: true,
      },
    });
  }

  update(id: string, data: UpdateFacilityDto) {
    return this.prisma.facility.update({
      where: { id },
      data,
      include: {
        establishment: true,
        professionals: true,
      },
    });
  }

  delete(id: string) {
    return this.prisma.facility.delete({
      where: { id },
    });
  }
}
