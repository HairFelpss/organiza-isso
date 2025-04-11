import { Injectable, NotFoundException } from '@nestjs/common';
import { checkDatabaseDataConflict } from '../common/helpers/check-database-data-conflict';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(data: CreateUserDto) {
    const { email, document, phone } = data;

    await checkDatabaseDataConflict([
      {
        check: this.usersRepository.findByDocument(document),
        message: 'CPF já cadastrado',
      },
      {
        check: this.usersRepository.findByEmail(email),
        message: 'Email já cadastrado',
      },
      {
        check: this.usersRepository.findByPhone(phone),
        message: 'Telefone já cadastrado',
      },
    ]);

    return this.usersRepository.create(data);
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

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  findByDocument(document: string) {
    return this.usersRepository.findByDocument(document);
  }

  findByPhone(phone: string) {
    return this.usersRepository.findByPhone(phone);
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
