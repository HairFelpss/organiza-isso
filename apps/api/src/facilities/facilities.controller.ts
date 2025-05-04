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
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { FacilitiesService } from './facilities.service';

@ApiTags('Facilities')
@ApiBearerAuth()
@Controller('facilities')
@UseGuards(JwtAuthGuard)
export class FacilitiesController {
  constructor(private readonly service: FacilitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new facility' })
  @UsePipes(new ZodValidationPipe(CreateFacilityDto.schema))
  create(@Body() dto: CreateFacilityDto) {
    return this.service.create(dto);
  }

  @Get('establishment/:establishmentId')
  @ApiOperation({ summary: 'List facilities by establishment' })
  findByEstablishment(@Param('establishmentId') establishmentId: string) {
    return this.service.findByEstablishmentId(establishmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get facility by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update facility' })
  @UsePipes(new ZodValidationPipe(UpdateFacilityDto.schema))
  update(@Param('id') id: string, @Body() dto: UpdateFacilityDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete facility' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
