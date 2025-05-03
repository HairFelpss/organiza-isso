import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from '../i18n/i18n.service';

import { CalendarEventRepository } from './calendar-events.repository';
import {
  CreateCalendarEventDto,
  FindEventsParamsDto,
} from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@Injectable()
export class CalendarEventsService {
  constructor(
    private readonly repository: CalendarEventRepository,
    private readonly i18nService: I18nService,
  ) {}

  async create(data: CreateCalendarEventDto) {
    const hasConflict = await this.repository.checkConflicts(
      data.calendarId,
      data.startTime,
      data.endTime,
    );

    if (hasConflict) {
      throw new BadRequestException(
        this.i18nService.t('calendar.errors.eventConflict'),
      );
    }

    return this.repository.create(data);
  }

  async createMany(
    calendarId: string,
    events: Omit<CreateCalendarEventDto, 'calendarId'>[],
  ) {
    // Valida todos os eventos antes de criar
    for (const event of events) {
      const hasConflict = await this.repository.checkConflicts(
        calendarId,
        event.startTime,
        event.endTime,
      );

      if (hasConflict) {
        throw new BadRequestException(
          this.i18nService.t('calendar.errors.eventConflict'),
        );
      }
    }

    return this.repository.createMany(calendarId, events);
  }

  async findById(id: string) {
    const event = await this.repository.findById(id);
    if (!event) {
      throw new NotFoundException(
        this.i18nService.t('calendar.errors.eventNotFound'),
      );
    }
    return event;
  }

  async findByCalendarId(calendarId: string, params?: FindEventsParamsDto) {
    return this.repository.findByCalendarId(calendarId, params);
  }

  async update(id: string, data: UpdateCalendarEventDto) {
    const event = await this.repository.findById(id);
    if (!event) {
      throw new NotFoundException(
        this.i18nService.t('calendar.errors.eventNotFound'),
      );
    }

    if (data.startTime || data.endTime) {
      const startTime = data.startTime || event.startTime;
      const endTime = data.endTime || event.endTime;

      const hasConflict = await this.repository.checkConflicts(
        event.calendarId,
        startTime,
        endTime,
        id,
      );

      if (hasConflict) {
        throw new BadRequestException(
          this.i18nService.t('calendar.errors.eventConflict'),
        );
      }
    }

    return this.repository.update(id, data);
  }

  async delete(id: string) {
    const event = await this.repository.findById(id);
    if (!event) {
      throw new NotFoundException(
        this.i18nService.t('calendar.errors.eventNotFound'),
      );
    }

    if (event.appointment) {
      throw new BadRequestException(
        this.i18nService.t('calendar.errors.cannotDeleteEventWithAppointment'),
      );
    }

    return this.repository.delete(id);
  }

  async deleteMany(ids: string[]) {
    const events = await Promise.all(
      ids.map((id) => this.repository.findById(id)),
    );

    const eventsWithAppointments = events.filter(
      (event) => event && event.appointment,
    );

    if (eventsWithAppointments.length > 0) {
      throw new BadRequestException(
        this.i18nService.t(
          'calendar.errors.cannotDeleteEventsWithAppointments',
        ),
      );
    }

    return this.repository.deleteMany(ids);
  }

  async findAvailableSlots(
    calendarId: string,
    startDate: Date,
    endDate: Date,
    duration: number,
  ) {
    if (duration <= 0) {
      throw new BadRequestException(
        this.i18nService.t('calendar.errors.invalidDuration'),
      );
    }

    return this.repository.findAvailableSlots(
      calendarId,
      startDate,
      endDate,
      duration,
    );
  }

  async cleanOldEvents(calendarId: string, beforeDate: Date) {
    if (beforeDate > new Date()) {
      throw new BadRequestException(
        this.i18nService.t('calendar.errors.invalidCleanupDate'),
      );
    }

    return this.repository.cleanOldEvents(calendarId, beforeDate);
  }

  getEventStats(calendarId: string) {
    return this.repository.getEventStats(calendarId);
  }
}
