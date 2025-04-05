import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsRepository } from './professionals.repository';
import { ProfessionalsService } from './professionals.service';

@Module({
  controllers: [ProfessionalsController],
  providers: [
    ProfessionalsService,
    ProfessionalsService,
    ProfessionalsRepository,
    PrismaService,
  ],
})
export class ProfessionalsModule {}
