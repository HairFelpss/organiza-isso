import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '@organiza-isso-app/zod';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
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

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
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
