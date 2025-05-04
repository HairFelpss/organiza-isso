import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from '../i18n/i18n.service';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesQueryDto } from './schemas/companies-query.schema';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly repository: CompaniesRepository,
    private readonly i18nService: I18nService,
  ) {}

  async create(data: CreateCompanyDto, ownerId: string) {
    return this.repository.create(data, ownerId);
  }

  async findAll(params?: CompaniesQueryDto) {
    return this.repository.findAll(params);
  }

  async findById(id: string) {
    const company = await this.repository.findById(id);
    if (!company) {
      throw new NotFoundException(
        this.i18nService.t('companies.errors.notFound'),
      );
    }
    return company;
  }

  async update(id: string, data: UpdateCompanyDto) {
    await this.findById(id);
    return this.repository.update(id, data);
  }

  async remove(id: string) {
    await this.findById(id);
    return this.repository.delete(id);
  }
}
