import { Module } from '@nestjs/common';
import { CompaniesModule } from '../companies/companies.module';
import { I18nService } from '../i18n/i18n.service';
import { PrismaService } from '../prisma/prisma.service';
import { EstablishmentsController } from './establishments.controller';
import { EstablishmentsRepository } from './establishments.repository';
import { EstablishmentsService } from './establishments.service';

@Module({
  imports: [CompaniesModule],
  controllers: [EstablishmentsController],
  providers: [
    EstablishmentsService,
    EstablishmentsRepository,
    PrismaService,
    I18nService,
  ],
  exports: [EstablishmentsService],
})
export class EstablishmentsModule {}
