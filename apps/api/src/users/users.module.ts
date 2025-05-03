import { Module } from '@nestjs/common';
import { I18nService } from '../i18n/i18n.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UsersRepository, PrismaService, I18nService],
  exports: [UsersService],
})
export class UsersModule {}
