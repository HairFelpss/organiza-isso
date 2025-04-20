import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, Plan } from '@prisma/client';
import { I18nService } from '../i18n/i18n.service';
import { UsersService } from '../users/users.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalsRepository } from './professionals.repository';

@Injectable()
export class ProfessionalsService {
  constructor(
    private readonly repository: ProfessionalsRepository,
    private readonly userService: UsersService,
    private readonly i18nService: I18nService,
  ) {}

  async create(data: CreateProfessionalDto, userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.userNotFound'),
      );
    }

    const existingProfessional = await this.repository.findByUserId(userId);

    if (existingProfessional) {
      throw new ConflictException(
        this.i18nService.t('professionals.errors.alreadyProfessional'),
      );
    }

    if (data.companyId) {
      const company = await this.repository.findCompanyById(data.companyId);
      if (!company) {
        throw new NotFoundException(
          this.i18nService.t('professionals.errors.companyNotFound'),
        );
      }
    }

    // Atualiza o role do usuário para PROFESSIONAL
    await this.userService.update(userId, { role: 'PROFESSIONAL' });

    return this.repository.create(data, userId);
  }

  async findAll(params?: {
    search?: string;
    specialties?: string[];
    isActive?: boolean;
    companyId?: string;
    subscriptionPlan?: Plan;
    minRating?: number;
    page?: number;
    limit?: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
  }) {
    return this.repository.findAll(params);
  }

  async dashboard(professionalId: string) {
    const professional = await this.repository.findWithUser(professionalId);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }

    const [appointmentsData, ratingsData, upcomingAppointments, stats] =
      await Promise.all([
        this.repository.findAppointmentsByProfessionalId(professionalId, {
          limit: 5,
        }),
        this.repository.findRatingsByProfessionalId(professionalId, {
          limit: 3,
        }),
        this.repository.findUpcomingAppointments(professionalId, {
          status: 'CONFIRMED',
          limit: 5,
        }),
        this.repository.getProfessionalStats(professionalId),
      ]);

    return {
      profile: professional,
      stats,
      upcomingAppointments,
      recentAppointments: appointmentsData.appointments,
      recentRatings: ratingsData.ratings,
    };
  }

  async findOne(id: string) {
    const professional = await this.repository.findById(id);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }
    return professional;
  }

  async getPrivateProfile(id: string) {
    const professional = await this.repository.findWithDetails(id);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }
    return professional;
  }

  async getSchedule(
    id: string,
    params?: {
      startDate?: Date;
      endDate?: Date;
      isAvailable?: boolean;
    },
  ) {
    const professional = await this.repository.findById(id);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }

    return this.repository.findSchedule(id, params);
  }

  async getRatings(
    id: string,
    params?: {
      page?: number;
      limit?: number;
      minScore?: number;
      maxScore?: number;
      orderBy?: string;
      order?: 'asc' | 'desc';
    },
  ) {
    const professional = await this.repository.findById(id);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }

    return this.repository.findRatings(id, params);
  }

  async update(id: string, dto: UpdateProfessionalDto) {
    const professional = await this.repository.findById(id);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }

    if (dto.companyId) {
      const company = await this.repository.findCompanyById(dto.companyId);
      if (!company) {
        throw new NotFoundException(
          this.i18nService.t('professionals.errors.companyNotFound'),
        );
      }
    }

    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    const professional = await this.repository.findById(id);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }

    // Atualiza o role do usuário de volta para CLIENT
    await this.userService.update(professional.userId, { role: 'CLIENT' });

    return this.repository.delete(id);
  }

  // Métodos adicionais para gerenciamento de calendário
  async createCalendar(professionalId: string) {
    const professional = await this.repository.findById(professionalId);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }

    return this.repository.createCalendar(professionalId);
  }

  async addCalendarBlock(
    professionalId: string,
    data: {
      dateTime: Date;
      duration: number;
      isAvailable: boolean;
      reason?: string;
    },
  ) {
    const professional = await this.repository.findById(professionalId);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }

    return this.repository.addCalendarBlock(professionalId, data);
  }

  // Métodos para gerenciamento de agendamentos
  async getAppointments(
    professionalId: string,
    params?: {
      status?: AppointmentStatus;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    },
  ) {
    const professional = await this.repository.findById(professionalId);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }

    return this.repository.findAppointments(professionalId, params);
  }

  async updateAppointmentStatus(
    professionalId: string,
    appointmentId: string,
    status: AppointmentStatus,
  ) {
    const professional = await this.repository.findById(professionalId);
    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }

    return this.repository.updateAppointmentStatus(appointmentId, status);
  }
}
