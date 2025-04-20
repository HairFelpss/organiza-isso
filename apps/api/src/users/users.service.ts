import { Injectable, NotFoundException } from '@nestjs/common';
import { checkDatabaseDataConflict } from '../common/helpers/check-database-data-conflict';
import { I18nService } from '../i18n/i18n.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly i18nService: I18nService,
  ) {}

  async create(data: CreateUserDto) {
    const { email, document, phone } = data;

    await checkDatabaseDataConflict([
      {
        check: this.findByDocument(document),
        message: this.i18nService.t('users.errors.documentAlreadyExists'),
      },
      {
        check: this.findByEmail(email),
        message: this.i18nService.t('users.errors.emailAlreadyExists'),
      },
      {
        check: this.findByPhone(phone),
        message: this.i18nService.t('users.errors.phoneAlreadyExists'),
      },
    ]);

    const user = await this.usersRepository.create(data);

    return {
      message: this.i18nService.t('users.success.created'),
      user,
    };
  }

  async findAll(params: FilterUserDto) {
    const { users, metadata } = await this.usersRepository.findAll(params);

    if (!users.length) {
      return {
        message: this.i18nService.t('users.info.noUsersFound'),
        users: [],
        metadata,
      };
    }

    return {
      message: this.i18nService.t('users.success.listed'),
      users,
      metadata,
    };
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('users.errors.notFound', { id }),
      );
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
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('users.errors.notFound', { id }),
      );
    }

    // Verifica se o email está sendo atualizado e se já existe
    if (data.email && data.email !== user.email) {
      const existingEmail = await this.findByEmail(data.email);
      if (existingEmail) {
        throw new NotFoundException(
          this.i18nService.t('users.errors.emailAlreadyExists'),
        );
      }
    }

    // Verifica se o telefone está sendo atualizado e se já existe
    if (data.phone && data.phone !== user.phone) {
      if (await this.findByPhone(data.phone)) {
        throw new NotFoundException(
          this.i18nService.t('users.errors.phoneAlreadyExists'),
        );
      }
    }

    const updatedUser = await this.usersRepository.update(id, data);

    return {
      message: this.i18nService.t('users.success.updated'),
      user: updatedUser,
    };
  }

  async remove(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('users.errors.notFound', { id }),
      );
    }

    await this.usersRepository.delete(id);

    return {
      message: this.i18nService.t('users.success.deleted'),
      id,
    };
  }
}
