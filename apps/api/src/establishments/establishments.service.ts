import { Injectable, NotFoundException } from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import { I18nService } from '../i18n/i18n.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { EstablishmentsRepository } from './establishments.repository';

@Injectable()
export class EstablishmentsService {
  constructor(
    private readonly repository: EstablishmentsRepository,
    private readonly companiesService: CompaniesService,
    private readonly i18nService: I18nService,
  ) {}

  async create(data: CreateEstablishmentDto) {
    await this.companiesService.findById(data.companyId);
    return this.repository.create(data);
  }

  async findById(id: string) {
    const establishment = await this.repository.findById(id);
    if (!establishment) {
      throw new NotFoundException(
        this.i18nService.t('establishments.errors.notFound'),
      );
    }
    return establishment;
  }

  async findByCompanyId(companyId: string) {
    await this.companiesService.findById(companyId);
    return this.repository.findByCompanyId(companyId);
  }

  async update(id: string, data: UpdateEstablishmentDto) {
    await this.findById(id);
    if (data.companyId) {
      await this.companiesService.findById(data.companyId);
    }
    return this.repository.update(id, data);
  }

  async remove(id: string) {
    await this.findById(id);
    return this.repository.delete(id);
  }
}
