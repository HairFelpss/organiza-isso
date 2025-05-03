import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';
import { AppointmentsQueryDto } from '../appointments/schemas/appointments-query.schema';
import { I18nService } from '../i18n/i18n.service';
import { UsersService } from '../users/users.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalsRepository } from './professionals.repository';
import { ProfessionalsQueryDto } from './schemas/professionals-query.schema';

@Injectable()
export class ProfessionalsService {
  constructor(
    private readonly repository: ProfessionalsRepository,
    private readonly userService: UsersService,
    @Inject(forwardRef(() => AppointmentsService))
    private appointmentsService: AppointmentsService,
    private readonly i18nService: I18nService,
  ) {}

  async create(data: CreateProfessionalDto, userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.userNotFound'),
      );
    }

    const existingProfessional = await this.repository.findByUserId(user.id);

    if (existingProfessional) {
      throw new ConflictException(
        this.i18nService.t('professionals.errors.alreadyExists'),
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

  async findAll(params?: ProfessionalsQueryDto) {
    return this.repository.findAll(params);
  }

  async dashboard(professionalId: string, query?: AppointmentsQueryDto) {
    const professional = await this.findById(professionalId);

    // const [appointmentsData, ratingsData, upcomingAppointments, stats] =
    const [appointmentsData, stats] = await Promise.all([
      this.appointmentsService.findAllAppointmentsByProfessional(
        professionalId,
        query,
      ),
      // this.repository.findRatingsByProfessionalId(professionalId, {
      //   limit: 3,
      // }),
      // this.appointmentsService.findUpcomingAppointments(professionalId, {
      //   status: 'CONFIRMED',
      //   limit: 5,
      // }),
      this.repository.getProfessionalStats(professionalId),
    ]);

    return {
      profile: professional,
      stats,
      //upcomingAppointments,
      recentAppointments: appointmentsData.appointments,
      //recentRatings: ratingsData.ratings,
    };
  }

  async findById(id: string) {
    const professional = await this.repository.findById(id);

    if (!professional) {
      throw new NotFoundException(
        this.i18nService.t('professionals.errors.notFound'),
      );
    }

    return professional;
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
    const professional = await this.findById(id);

    return this.repository.findRatings(professional.id, params);
  }

  async update(id: string, dto: UpdateProfessionalDto) {
    const professional = await this.findById(id);

    if (dto.companyId) {
      const company = await this.repository.findCompanyById(dto.companyId);
      if (!company) {
        throw new NotFoundException(
          this.i18nService.t('professionals.errors.companyNotFound'),
        );
      }
    }

    return this.repository.update(professional.id, dto);
  }

  async remove(id: string) {
    const professional = await this.findById(id);

    // Atualiza o role do usuário de volta para CLIENT
    await this.userService.update(professional.userId, { role: 'CLIENT' });

    return this.repository.delete(id);
  }
}
