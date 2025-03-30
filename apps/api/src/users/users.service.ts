import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    // Verifica se o email já está cadastrado
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new NotFoundException(
        `Usuário com email ${data.email} já cadastrado`,
      );
    }

    // Verifica se o CPF já está cadastrado
    const existingCpf = await this.prisma.user.findUnique({
      where: { cpf: data.cpf },
    });

    if (existingCpf) {
      throw new NotFoundException(`Usuário com CPF ${data.cpf} já cadastrado`);
    }

    // Verifica se o telefone já está cadastrado
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (existingPhone) {
      throw new NotFoundException(
        `Usuário com telefone ${data.phone} já cadastrado`,
      );
    }

    const user = await this.prisma.user.create({ data });
    return user;
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

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: 'Usuário removido com sucesso', id };
  }
}
