import { Module, forwardRef } from '@nestjs/common';
import { CalendarEventRepository } from '../calendar-events/calendar-events.repository';
import { CalendarEventsService } from '../calendar-events/calendar-events.service';
import { I18nService } from '../i18n/i18n.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProfessionalsModule } from '../professionals/professionals.module';
import { UsersModule } from '../users/users.module';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsRepository } from './appointments.repository';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [forwardRef(() => ProfessionalsModule), UsersModule],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    AppointmentsRepository,
    CalendarEventsService,
    CalendarEventRepository,
    PrismaService,
    I18nService,
  ],
  exports: [AppointmentsService], // Importante exportar o serviço
})
export class AppointmentsModule {}
