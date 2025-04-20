import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        refreshToken: true,
        createdAt: true,
        updatedAt: true,
        phone: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByDocument(document: string) {
    return this.prisma.user.findUnique({ where: { document } });
  }

  async findByPhone(phone: string) {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  async create(data: CreateUserDto) {
    return this.prisma.user.create({ data: { ...data, role: Role.CLIENT } });
  }

  async findAll(params: FilterUserDto) {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      orderBy = 'createdAt',
      order = 'desc',
      isActive,
    } = params;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.UserWhereInput = {
      // Add search condition if search is provided
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      // Add role filter if provided
      ...(role && { role }),
      // Add isActive filter if provided
      ...(typeof isActive === 'boolean' && { isActive }),
    };

    // Execute count and findMany in parallel
    const [total, users] = await Promise.all([
      // Get total count
      this.prisma.user.count({ where }),
      // Get paginated results
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          // isActive: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: {
          [orderBy]: order,
        },
      }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      users,
      metadata: {
        total,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: { ...data, role: data.role ?? Role.CLIENT },
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
