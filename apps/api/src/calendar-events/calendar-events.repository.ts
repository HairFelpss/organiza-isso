// src/calendar-events/calendar-event.repository.ts
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCalendarEventDto,
  FindEventsParamsDto,
} from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@Injectable()
export class CalendarEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCalendarEventDto) {
    return this.prisma.calendarEvent.create({
      data,
      include: { appointment: true, calendar: true },
    });
  }

  async createMany(
    calendarId: string,
    events: Omit<CreateCalendarEventDto, 'calendarId'>[],
  ) {
    const data = events.map((event) => ({
      ...event,
      calendarId,
    }));

    // Prisma createMany não retorna os registros criados, apenas count
    await this.prisma.calendarEvent.createMany({ data });
    // Retorna os eventos criados
    return this.prisma.calendarEvent.findMany({
      where: { calendarId },
      orderBy: { startTime: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.calendarEvent.findUnique({
      where: { id },
      include: { appointment: true, calendar: true },
    });
  }

  async findByCalendarId(calendarId: string, params?: FindEventsParamsDto) {
    const {
      startDate,
      endDate,
      eventType,
      isAvailable,
      page = 1,
      limit = 10,
      orderBy = 'startTime',
      order = 'asc',
    } = params || {};

    const where: Prisma.CalendarEventWhereInput = {
      calendarId,
      ...(startDate && { startTime: { gte: startDate } }),
      ...(endDate && { endTime: { lte: endDate } }),
      ...(eventType && { eventType }),
      ...(typeof isAvailable === 'boolean' && { isAvailable }),
    };

    const [total, items] = await Promise.all([
      this.prisma.calendarEvent.count({ where }),
      this.prisma.calendarEvent.findMany({
        where,
        include: { appointment: true, calendar: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [orderBy]: order },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: UpdateCalendarEventDto) {
    return this.prisma.calendarEvent.update({
      where: { id },
      data,
      include: { appointment: true, calendar: true },
    });
  }

  async delete(id: string) {
    return this.prisma.calendarEvent.delete({
      where: { id },
    });
  }

  async deleteMany(ids: string[]) {
    return this.prisma.calendarEvent.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async checkConflicts(
    calendarId: string,
    startTime: Date,
    endTime: Date,
    excludeEventId?: string,
  ) {
    const count = await this.prisma.calendarEvent.count({
      where: {
        calendarId,
        id: excludeEventId ? { not: excludeEventId } : undefined,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    return count > 0;
  }

  async findAvailableSlots(
    calendarId: string,
    startDate: Date,
    endDate: Date,
    duration: number,
  ) {
    const events = await this.prisma.calendarEvent.findMany({
      where: {
        calendarId,
        startTime: { gte: startDate },
        endTime: { lte: endDate },
      },
      orderBy: { startTime: 'asc' },
    });

    const availableSlots: { startTime: Date; endTime: Date }[] = [];
    let currentTime = startDate;

    for (const event of events) {
      if (currentTime < event.startTime) {
        const slotDuration = event.startTime.getTime() - currentTime.getTime();
        if (slotDuration >= duration * 60 * 1000) {
          availableSlots.push({
            startTime: currentTime,
            endTime: event.startTime,
          });
        }
      }
      currentTime = event.endTime > currentTime ? event.endTime : currentTime;
    }

    if (currentTime < endDate) {
      const slotDuration = endDate.getTime() - currentTime.getTime();
      if (slotDuration >= duration * 60 * 1000) {
        availableSlots.push({
          startTime: currentTime,
          endTime: endDate,
        });
      }
    }

    return availableSlots;
  }

  async cleanOldEvents(calendarId: string, beforeDate: Date) {
    return this.prisma.calendarEvent.deleteMany({
      where: {
        calendarId,
        endTime: { lt: beforeDate },
        appointment: null,
      },
    });
  }

  async getEventStats(calendarId: string) {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const [total, today, upcoming, completed] = await Promise.all([
      this.prisma.calendarEvent.count({ where: { calendarId } }),
      this.prisma.calendarEvent.count({
        where: {
          calendarId,
          startTime: { gte: startOfDay },
          endTime: { lte: endOfDay },
        },
      }),
      this.prisma.calendarEvent.count({
        where: {
          calendarId,
          startTime: { gt: now },
        },
      }),
      this.prisma.calendarEvent.count({
        where: {
          calendarId,
          endTime: { lt: now },
        },
      }),
    ]);

    return {
      total,
      today,
      upcoming,
      completed,
    };
  }
}
