// src/professionals/professionals.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalsRepository } from './professionals.repository';

@Injectable()
export class ProfessionalsService {
  constructor(private readonly repository: ProfessionalsRepository) {}

  create(dto: CreateProfessionalDto, userId: string) {
    return this.repository.create(dto, userId);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async dashboard(professionalId: string) {
    const profile = await this.repository.findWithUser(professionalId);
    if (!profile) {
      throw new NotFoundException('Profissional não encontrado');
    }

    const appointments =
      await this.repository.findScheduleByProfessionalId(professionalId);

    if (appointments?.length === 0) {
      throw new NotFoundException('Agendas não encontradas');
    }

    const ratings =
      await this.repository.findRatingsByProfessionalId(professionalId);

    if (ratings?.length === 0) {
      throw new NotFoundException('Avaliações não encontradas');
    }

    return {
      profile,
      upcomingAppointments: appointments.slice(0, 5),
      recentRatings: ratings.slice(0, 3),
    };
  }

  async findOne(id: string) {
    const professional = await this.repository.findById(id);
    if (!professional) {
      throw new NotFoundException(`Profissional com ID ${id} não encontrado`);
    }
    return professional;
  }

  async getPrivateProfile(id: string) {
    const professional = await this.repository.findWithUser(id);
    if (!professional) {
      throw new NotFoundException(
        `Perfil do professional ${id} não encontrado`,
      );
    }
    return professional;
  }

  async getSchedule(id: string) {
    const schedule = await this.repository.findScheduleByProfessionalId(id);
    if (!schedule || schedule.length === 0) {
      throw new NotFoundException(
        `Agenda do professional ${id} não encontrada`,
      );
    }
    return schedule;
  }

  async getRatings(id: string) {
    return this.repository.findRatingsByProfessionalId(id);
  }

  async update(id: string, dto: UpdateProfessionalDto) {
    const professional = await this.repository.findById(id);
    if (!professional) {
      throw new NotFoundException(`Profissional com ID ${id} não encontrado`);
    }
    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    const professional = await this.repository.findById(id);
    if (!professional) {
      throw new NotFoundException(`Profissional com ID ${id} não encontrado`);
    }
    return this.repository.delete(id);
  }
}
