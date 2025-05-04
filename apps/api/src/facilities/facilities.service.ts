import { Injectable, NotFoundException } from '@nestjs/common';
import { EstablishmentsService } from '../establishments/establishments.service';
import { I18nService } from '../i18n/i18n.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { FacilitiesRepository } from './facilities.repository';

@Injectable()
export class FacilitiesService {
  constructor(
    private readonly repository: FacilitiesRepository,
    private readonly establishmentsService: EstablishmentsService,
    private readonly i18nService: I18nService,
  ) {}

  async create(data: CreateFacilityDto) {
    await this.establishmentsService.findById(data.establishmentId);
    return this.repository.create(data);
  }

  async findById(id: string) {
    const facility = await this.repository.findById(id);
    if (!facility) {
      throw new NotFoundException(
        this.i18nService.t('facilities.errors.notFound'),
      );
    }
    return facility;
  }

  async findByEstablishmentId(establishmentId: string) {
    await this.establishmentsService.findById(establishmentId);
    return this.repository.findByEstablishmentId(establishmentId);
  }

  async update(id: string, data: UpdateFacilityDto) {
    await this.findById(id);
    if (data.establishmentId) {
      await this.establishmentsService.findById(data.establishmentId);
    }
    return this.repository.update(id, data);
  }

  async remove(id: string) {
    await this.findById(id);
    return this.repository.delete(id);
  }
}
