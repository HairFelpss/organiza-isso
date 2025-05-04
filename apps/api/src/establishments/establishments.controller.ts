import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { EstablishmentsService } from './establishments.service';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentsController {
  constructor(private readonly service: EstablishmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new establishment' })
  @UsePipes(new ZodValidationPipe(CreateEstablishmentDto.schema))
  create(@Body() dto: CreateEstablishmentDto) {
    return this.service.create(dto);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'List establishments by company' })
  findByCompany(@Param('companyId') companyId: string) {
    return this.service.findByCompanyId(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get establishment by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update establishment' })
  @UsePipes(new ZodValidationPipe(UpdateEstablishmentDto.schema))
  update(@Param('id') id: string, @Body() dto: UpdateEstablishmentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete establishment' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
