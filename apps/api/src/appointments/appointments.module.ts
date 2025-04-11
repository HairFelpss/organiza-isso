import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsRepository } from './appointments.repository';
import { AppointmentsService } from './appointments.service';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsRepository, PrismaService],
})
export class AppointmentsModule {}
