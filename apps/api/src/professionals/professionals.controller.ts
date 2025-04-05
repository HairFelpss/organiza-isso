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
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RoleGuard } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalsService } from './professionals.service';

@ApiTags('Professionals')
@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateProfessionalDto.schema))
  create(
    @Body() dto: CreateProfessionalDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.professionalsService.create(dto, user.id);
  }

  @Get('dashboard')
  @UseGuards(RolesGuard)
  @RoleGuard(Role.PROFESSIONAL)
  getProfessionalDashboard(@CurrentUser() user: { id: string }) {
    return this.professionalsService.dashboard(user.id);
  }

  @Get()
  findAll() {
    return this.professionalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professionalsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @RoleGuard(Role.PROFESSIONAL)
  @Get(':id/profile')
  getPrivateProfile(@Param('id') id: string) {
    return this.professionalsService.getPrivateProfile(id);
  }

  @Get(':id/schedule')
  getSchedule(@Param('id') id: string) {
    return this.professionalsService.getSchedule(id);
  }

  @Get(':id/ratings')
  getRatings(@Param('id') id: string) {
    return this.professionalsService.getRatings(id);
  }

  @UseGuards(RolesGuard)
  @RoleGuard(Role.PROFESSIONAL)
  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateProfessionalDto.schema))
  update(@Param('id') id: string, @Body() dto: UpdateProfessionalDto) {
    return this.professionalsService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @RoleGuard(Role.PROFESSIONAL)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professionalsService.remove(id);
  }
}
