import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesQueryDto } from './schemas/companies-query.schema';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCompanyDto, ownerId: string) {
    return this.prisma.company.create({
      data: {
        ...data,
        ownerId,
      },
      include: {
        professionals: true,
        establishments: true,
      },
    });
  }

  async findAll(params?: CompaniesQueryDto) {
    const {
      search,
      type,
      isActive,
      page = 1,
      limit = 10,
      orderBy = 'createdAt',
      order = 'desc',
    } = params || {};

    const where: Prisma.CompanyWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(type && { type }),
      ...(typeof isActive === 'boolean' && { isActive }),
    };

    const [total, companies] = await Promise.all([
      this.prisma.company.count({ where }),
      this.prisma.company.findMany({
        where,
        include: {
          _count: {
            select: {
              professionals: true,
              establishments: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [orderBy]: order },
      }),
    ]);

    return {
      companies,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findById(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
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
        establishments: {
          include: {
            facilities: true,
          },
        },
      },
    });
  }

  update(id: string, data: UpdateCompanyDto) {
    return this.prisma.company.update({
      where: { id },
      data,
      include: {
        professionals: true,
        establishments: true,
      },
    });
  }

  delete(id: string) {
    return this.prisma.company.delete({
      where: { id },
    });
  }
}
