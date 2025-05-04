import { Module } from '@nestjs/common';
import { EstablishmentsModule } from '../establishments/establishments.module';
import { I18nService } from '../i18n/i18n.service';
import { PrismaService } from '../prisma/prisma.service';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesRepository } from './facilities.repository';
import { FacilitiesService } from './facilities.service';

@Module({
  imports: [EstablishmentsModule],
  controllers: [FacilitiesController],
  providers: [
    FacilitiesService,
    FacilitiesRepository,
    PrismaService,
    I18nService,
  ],
  exports: [FacilitiesService],
})
export class FacilitiesModule {}
