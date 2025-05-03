import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { CalendarEventsService } from '../calendar-events/calendar-events.service';
import { I18nService } from '../i18n/i18n.service';
import { ProfessionalsService } from '../professionals/professionals.service';
import { UsersService } from '../users/users.service';
import { AppointmentsRepository } from './appointments.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentsQueryDto } from './schemas/appointments-query.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly repository: AppointmentsRepository,
    @Inject(forwardRef(() => ProfessionalsService))
    private readonly professionalsService: ProfessionalsService,
    @Inject(forwardRef(() => CalendarEventsService))
    private readonly calendarEventsService: CalendarEventsService,
    private readonly i18nService: I18nService,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateAppointmentDto, userId: string) {
    // Validar evento de calendário
    const calendarEvent = await this.calendarEventsService.findById(
      dto.calendarEventId,
    );

    if (!calendarEvent) {
      throw new NotFoundException(
        this.i18nService.t('calendar.errors.eventNotFound'),
      );
    }

    if (!calendarEvent.isAvailable) {
      throw new BadRequestException(
        this.i18nService.t('calendar.errors.eventNotAvailable'),
      );
    }

    if (calendarEvent.appointment) {
      throw new BadRequestException(
        this.i18nService.t('calendar.errors.eventAlreadyBooked'),
      );
    }

    // Verificar conflitos
    const hasConflict = await this.calendarEventsService[
      'repository'
    ].checkConflicts(
      calendarEvent.calendarId,
      calendarEvent.startTime,
      calendarEvent.endTime,
      calendarEvent.id,
    );
    if (hasConflict) {
      throw new BadRequestException(
        this.i18nService.t('calendar.errors.eventConflict'),
      );
    }

    return this.repository.create(dto, userId);
  }

  async findAllAppointmentsByUserId(
    userId: string,
    params: AppointmentsQueryDto,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(this.i18nService.t('users.errors.notFound'));
    }

    const { startDate, endDate } = params;
    if (startDate && endDate && startDate > endDate) {
      throw new BadRequestException(
        this.i18nService.t('appointments.errors.invalidDateRange'),
      );
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    if (startDate && startDate < oneYearAgo) {
      throw new BadRequestException(
        this.i18nService.t('appointments.errors.startDateTooOld'),
      );
    }

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (endDate && endDate > oneYearFromNow) {
      throw new BadRequestException(
        this.i18nService.t('appointments.errors.endDateTooFar'),
      );
    }

    if (params.status === 'CANCELED') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      params.startDate = params.startDate || thirtyDaysAgo;
    }

    const orderBy = params.orderBy || 'startTime';
    const order = params.order || 'desc';

    try {
      const result = await this.repository.findAllAppointmentsByUserId(userId, {
        ...params,
        orderBy,
        order,
      });

      const processedAppointments = await Promise.all(
        result.appointments.map(async (appointment) => {
          const calendarEvent = await this.calendarEventsService.findById(
            appointment.calendarEventId,
          );

          return {
            ...appointment,
            isLate:
              calendarEvent.startTime < new Date() &&
              appointment.status === 'PENDING',
            canCancel: this.canCancelAppointment(calendarEvent.startTime),
          };
        }),
      );

      return {
        ...result,
        appointments: processedAppointments,
      };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw new Error(this.i18nService.t('appointments.errors.fetchError'));
    }
  }

  async findOne(id: string) {
    const appointment = await this.repository.findById(id);
    if (!appointment) {
      throw new NotFoundException(
        this.i18nService.t('appointments.errors.notFound'),
      );
    }

    const calendarEvent = await this.calendarEventsService.findById(
      appointment.calendarEventId,
    );
    if (!calendarEvent) {
      throw new NotFoundException(
        this.i18nService.t('calendar.errors.eventNotFound'),
      );
    }

    return {
      ...appointment,
      calendarEvent,
    };
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    const appointment = await this.repository.findById(id);
    if (!appointment) {
      throw new NotFoundException(
        this.i18nService.t('appointments.errors.notFound'),
      );
    }

    // Se estiver alterando o evento de calendário
    if (
      dto.calendarEventId &&
      dto.calendarEventId !== appointment.calendarEventId
    ) {
      const newCalendarEvent = await this.calendarEventsService.findById(
        dto.calendarEventId,
      );

      if (!newCalendarEvent) {
        throw new NotFoundException(
          this.i18nService.t('calendar.errors.eventNotFound'),
        );
      }

      if (!newCalendarEvent.isAvailable) {
        throw new BadRequestException(
          this.i18nService.t('calendar.errors.eventNotAvailable'),
        );
      }

      if (newCalendarEvent.appointment) {
        throw new BadRequestException(
          this.i18nService.t('calendar.errors.eventAlreadyBooked'),
        );
      }

      const hasConflict = await this.calendarEventsService[
        'repository'
      ].checkConflicts(
        newCalendarEvent.calendarId,
        newCalendarEvent.startTime,
        newCalendarEvent.endTime,
        newCalendarEvent.id,
      );
      if (hasConflict) {
        throw new BadRequestException(
          this.i18nService.t('calendar.errors.eventConflict'),
        );
      }
    }

    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    const appointment = await this.repository.findById(id);
    if (!appointment) {
      throw new NotFoundException(
        this.i18nService.t('appointments.errors.notFound'),
      );
    }

    // Liberar o evento de calendário
    await this.calendarEventsService.update(appointment.calendarEventId, {
      isAvailable: true,
      appointment: null,
    });

    return this.repository.delete(id);
  }

  async findAllAppointmentsByProfessional(
    professionalId: string,
    params: AppointmentsQueryDto = {} as AppointmentsQueryDto,
  ) {
    const professional =
      await this.professionalsService.findById(professionalId);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }

    const { startDate, endDate } = params;
    if (startDate && endDate && startDate > endDate) {
      throw new BadRequestException(
        this.i18nService.t('appointments.errors.invalidDateRange'),
      );
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    if (startDate && startDate < oneYearAgo) {
      throw new BadRequestException(
        this.i18nService.t('appointments.errors.startDateTooOld'),
      );
    }

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (endDate && endDate > oneYearFromNow) {
      throw new BadRequestException(
        this.i18nService.t('appointments.errors.endDateTooFar'),
      );
    }

    if (params.status === 'CANCELED') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      params.startDate = params.startDate || thirtyDaysAgo;
    }

    const orderBy = params.orderBy || 'startTime';
    const order = params.order || 'desc';

    try {
      const result = await this.repository.findAllAppointmentsByProfessionalId(
        professionalId,
        {
          ...params,
          orderBy,
          order,
        },
      );

      const processedAppointments = await Promise.all(
        result.appointments.map(async (appointment) => {
          const calendarEvent = await this.calendarEventsService.findById(
            appointment.calendarEventId,
          );

          return {
            ...appointment,
            calendarEvent,
            isLate:
              calendarEvent.startTime < new Date() &&
              appointment.status === 'PENDING',
            canCancel: this.canCancelAppointment(calendarEvent.startTime),
          };
        }),
      );

      return {
        ...result,
        appointments: processedAppointments,
      };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw new Error(this.i18nService.t('appointments.errors.fetchError'));
    }
  }

  private canCancelAppointment(appointmentDate: Date): boolean {
    const cancelDeadline = new Date(appointmentDate);
    cancelDeadline.setHours(cancelDeadline.getHours() - 24);
    return new Date() < cancelDeadline;
  }

  async updateAppointmentStatus(
    professionalId: string,
    appointmentId: string,
    status: AppointmentStatus,
  ) {
    const professional =
      await this.professionalsService.findById(professionalId);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }

    const appointment = await this.repository.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException(
        this.i18nService.t('appointments.errors.notFound'),
      );
    }

    // Se estiver cancelando, liberar o evento de calendário
    if (status === 'CANCELED') {
      await this.calendarEventsService.update(appointment.calendarEventId, {
        isAvailable: true,
      });
    }

    return this.repository.updateAppointmentStatus(appointmentId, status);
  }

  private getTimeUntilAppointment(appointmentDate: Date): {
    days: number;
    hours: number;
    minutes: number;
  } {
    const now = new Date();
    const diff = appointmentDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  }

  private canRescheduleAppointment(
    appointmentDate: Date,
    status: AppointmentStatus,
  ): boolean {
    if (status === 'CANCELED') return false;

    const now = new Date();
    const hoursUntilAppointment =
      (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntilAppointment > 24;
  }

  private needsConfirmation(
    appointmentDate: Date,
    status: AppointmentStatus,
  ): boolean {
    if (status !== 'PENDING') return false;

    const now = new Date();
    const hoursUntilAppointment =
      (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntilAppointment <= 48;
  }

  private groupAppointmentsByDate(appointments: any[]) {
    return appointments.reduce(
      (groups: Record<string, any[]>, appointment) => {
        const date = new Date(
          appointment.calendarEvent.startTime,
        ).toLocaleDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(appointment);
        return groups;
      },
      {} as Record<string, any[]>,
    );
  }

  async findUpcomingAppointments(
    professionalId: string,
    params: AppointmentsQueryDto,
  ) {
    const professional =
      await this.professionalsService.findById(professionalId);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }

    if (!professional.isActive) {
      throw new BadRequestException(
        this.i18nService.t('professionals.errors.inactive'),
      );
    }

    const normalizedParams: AppointmentsQueryDto = {
      ...params,
      limit: Math.min(params.limit || 5, 50),
      status:
        params.status && ['PENDING', 'CONFIRMED'].includes(params.status)
          ? params.status
          : undefined,
      orderBy: 'createdAt',
      order: 'asc',
    };

    try {
      const result = await this.repository.findUpcomingAppointments(
        professionalId,
        normalizedParams,
      );

      const processedAppointments = await Promise.all(
        result.appointments.map(async (appointment) => {
          const calendarEvent = await this.calendarEventsService.findById(
            appointment.calendarEventId,
          );

          return {
            ...appointment,
            calendarEvent,
            timeUntilAppointment: this.getTimeUntilAppointment(
              calendarEvent.startTime,
            ),
            isLate:
              calendarEvent.startTime < new Date() &&
              appointment.status === 'PENDING',
            canReschedule: this.canRescheduleAppointment(
              calendarEvent.startTime,
              appointment.status,
            ),
            canCancel: this.canCancelAppointment(calendarEvent.startTime),
            needsConfirmation: this.needsConfirmation(
              calendarEvent.startTime,
              appointment.status,
            ),
          };
        }),
      );

      const groupedAppointments = this.groupAppointmentsByDate(
        processedAppointments,
      );

      return {
        ...result,
        appointments: processedAppointments,
        groupedAppointments,
        summary: {
          total: result.metadata.total,
          pending: processedAppointments.filter((a) => a.status === 'PENDING')
            .length,
          confirmed: processedAppointments.filter(
            (a) => a.status === 'CONFIRMED',
          ).length,
          needsConfirmation: processedAppointments.filter(
            (a) => a.needsConfirmation,
          ).length,
        },
      };
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      throw new Error(
        this.i18nService.t('appointments.errors.fetchUpcomingError'),
      );
    }
  }
}
