// src/professionals/professionals.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { AppointmentsModule } from '../appointments/appointments.module';
import { I18nService } from '../i18n/i18n.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsRepository } from './professionals.repository';
import { ProfessionalsService } from './professionals.service';

@Module({
  imports: [forwardRef(() => AppointmentsModule), UsersModule],
  controllers: [ProfessionalsController],
  providers: [
    ProfessionalsService,
    ProfessionalsRepository,
    PrismaService,
    I18nService,
  ],
  exports: [ProfessionalsService], // Importante exportar o serviço
})
export class ProfessionalsModule {}
