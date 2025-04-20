import { Module } from '@nestjs/common';
import { I18nService } from '../i18n/i18n.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsRepository } from './professionals.repository';
import { ProfessionalsService } from './professionals.service';

@Module({
  controllers: [ProfessionalsController],
  providers: [
    ProfessionalsService,
    ProfessionalsRepository,
    PrismaService,
    UsersService,
    UsersRepository,
    I18nService,
  ],
})
export class ProfessionalsModule {}
