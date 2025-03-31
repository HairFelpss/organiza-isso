import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(data: CreateUserDto) {
    const { email, document, phone } = data;

    if (await this.usersRepository.findByEmail(email)) {
      throw new NotFoundException(`Usuário com email ${email} já cadastrado`);
    }

    if (await this.usersRepository.findByCpf(document)) {
      throw new NotFoundException(`Usuário com CPF ${document} já cadastrado`);
    }

    if (await this.usersRepository.findByPhone(phone)) {
      throw new NotFoundException(
        `Usuário com telefone ${phone} já cadastrado`,
      );
    }

    return this.usersRepository.create({
      ...data,
      role: Role.CLIENT,
    });
  }

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    console.log('id -> ', id);
    console.log('data -> ', data);

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return this.usersRepository.update(id, data);
  }

  async remove(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.usersRepository.delete(id);

    return { message: 'Usuário removido com sucesso', id };
  }
}
