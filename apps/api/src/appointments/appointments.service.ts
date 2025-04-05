import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly repository: AppointmentsRepository) {}

  create(dto: CreateAppointmentDto, userId: string) {
    return this.repository.create(dto, userId);
  }

  async findAllByUser(userId: string) {
    return this.repository.findAllByUser(userId);
  }

  async findOne(id: string) {
    const appointment = await this.repository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }
    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    const appointment = await this.repository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }
    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    const appointment = await this.repository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }
    return this.repository.delete(id);
  }
}
