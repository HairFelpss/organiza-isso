import { Module } from '@nestjs/common';
import { I18nService } from '../i18n/i18n.service';
import { PrismaService } from '../prisma/prisma.service';
import { CalendarEventsController } from './calendar-events.controller';
import { CalendarEventRepository } from './calendar-events.repository';
import { CalendarEventsService } from './calendar-events.service';

@Module({
  controllers: [CalendarEventsController],
  providers: [
    CalendarEventRepository,
    CalendarEventsService,
    PrismaService,
    I18nService,
  ],
})
export class CalendarEventsModule {}
