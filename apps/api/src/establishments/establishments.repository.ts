import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';

@Injectable()
export class EstablishmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateEstablishmentDto) {
    return this.prisma.establishment.create({
      data,
      include: {
        company: true,
        facilities: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.establishment.findUnique({
      where: { id },
      include: {
        company: true,
        facilities: {
          include: {
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
        },
      },
    });
  }

  findByCompanyId(companyId: string) {
    return this.prisma.establishment.findMany({
      where: { companyId },
      include: {
        facilities: true,
      },
    });
  }

  update(id: string, data: UpdateEstablishmentDto) {
    return this.prisma.establishment.update({
      where: { id },
      data,
      include: {
        company: true,
        facilities: true,
      },
    });
  }

  delete(id: string) {
    return this.prisma.establishment.delete({
      where: { id },
    });
  }
}
