import { Module } from '@nestjs/common';
import { I18nService } from '../i18n/i18n.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompaniesController } from './companies.controller';
import { CompaniesRepository } from './companies.repository';
import { CompaniesService } from './companies.service';

@Module({
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    CompaniesRepository,
    PrismaService,
    I18nService,
  ],
  exports: [CompaniesService],
})
export class CompaniesModule {}
