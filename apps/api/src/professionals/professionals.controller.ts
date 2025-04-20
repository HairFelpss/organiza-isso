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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RoleGuard } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalsService } from './professionals.service';

@ApiTags('Professionals')
@ApiBearerAuth()
@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new professional profile' })
  @ApiResponse({
    status: 201,
    description: 'Professional created successfully',
    schema: {
      example: {
        message: 'Professional created successfully',
        professional: {
          id: 'uuid',
          userId: 'uuid',
          businessName: 'Clínica Exemplo',
          specialties: ['Psicologia'],
          profileDescription: 'Atendimento humanizado',
          subscriptionPlan: 'FREE',
          isActive: true,
          companyId: null,
          averageRating: 0,
          totalRatings: 0,
          totalAppointments: 0,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
    schema: {
      example: {
        message: 'Validation failed',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @UsePipes(new ZodValidationPipe(CreateProfessionalDto.schema))
  create(
    @Body() dto: CreateProfessionalDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.professionalsService.create(dto, user.id);
  }

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get professional dashboard (only for professionals)',
  })
  @ApiResponse({
    status: 200,
    description: 'Professional dashboard data',
    schema: {
      example: {
        appointments: 10,
        ratings: 5,
        averageRating: 4.8,
        // outros dados relevantes
      },
    },
  })
  @UseGuards(RolesGuard)
  @RoleGuard(Role.PROFESSIONAL)
  getProfessionalDashboard(@CurrentUser() user: { id: string }) {
    return this.professionalsService.dashboard(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all professionals' })
  @ApiResponse({
    status: 200,
    description: 'Professionals listed successfully',
    schema: {
      example: {
        professionals: [
          {
            id: 'uuid',
            userId: 'uuid',
            businessName: 'Clínica Exemplo',
            specialties: ['Psicologia'],
            profileDescription: 'Atendimento humanizado',
            subscriptionPlan: 'FREE',
            isActive: true,
            companyId: null,
            averageRating: 0,
            totalRatings: 0,
            totalAppointments: 0,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
        metadata: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    },
  })
  findAll() {
    return this.professionalsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public professional profile by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Professional ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Professional found successfully',
    schema: {
      example: {
        professional: {
          id: 'uuid',
          userId: 'uuid',
          businessName: 'Clínica Exemplo',
          specialties: ['Psicologia'],
          profileDescription: 'Atendimento humanizado',
          subscriptionPlan: 'FREE',
          isActive: true,
          companyId: null,
          averageRating: 0,
          totalRatings: 0,
          totalAppointments: 0,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Professional not found',
    schema: {
      example: {
        message: 'Professional with ID {id} not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.professionalsService.findOne(id);
  }

  @Get(':id/profile')
  @ApiOperation({
    summary: 'Get private professional profile (only for professionals)',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Professional ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Private professional profile',
    schema: {
      example: {
        professional: {
          id: 'uuid',
          userId: 'uuid',
          businessName: 'Clínica Exemplo',
          specialties: ['Psicologia'],
          profileDescription: 'Atendimento humanizado',
          subscriptionPlan: 'FREE',
          isActive: true,
          companyId: null,
          averageRating: 0,
          totalRatings: 0,
          totalAppointments: 0,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          // dados privados adicionais
        },
      },
    },
  })
  @UseGuards(RolesGuard)
  @RoleGuard(Role.PROFESSIONAL)
  getPrivateProfile(@Param('id') id: string) {
    return this.professionalsService.getPrivateProfile(id);
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Get professional schedule by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Professional ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Professional schedule',
    schema: {
      example: {
        schedule: [
          {
            date: '2023-01-01T09:00:00.000Z',
            available: true,
          },
        ],
      },
    },
  })
  getSchedule(@Param('id') id: string) {
    return this.professionalsService.getSchedule(id);
  }

  @Get(':id/ratings')
  @ApiOperation({ summary: 'Get professional ratings by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Professional ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Professional ratings',
    schema: {
      example: {
        ratings: [
          {
            score: 5,
            comment: 'Excelente atendimento!',
            createdAt: '2023-01-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  getRatings(@Param('id') id: string) {
    return this.professionalsService.getRatings(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update professional profile (only for professionals)',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Professional ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Professional updated successfully',
    schema: {
      example: {
        message: 'Professional updated successfully',
        professional: {
          id: 'uuid',
          // ...outros campos
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
    schema: {
      example: {
        message: 'Validation failed',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Professional not found',
    schema: {
      example: {
        message: 'Professional with ID {id} not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @UseGuards(RolesGuard)
  @RoleGuard(Role.PROFESSIONAL)
  @UsePipes(new ZodValidationPipe(UpdateProfessionalDto.schema))
  update(@Param('id') id: string, @Body() dto: UpdateProfessionalDto) {
    return this.professionalsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete professional profile (only for professionals)',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Professional ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Professional deleted successfully',
    schema: {
      example: {
        message: 'Professional deleted successfully',
        id: 'uuid',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Professional not found',
    schema: {
      example: {
        message: 'Professional with ID {id} not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @UseGuards(RolesGuard)
  @RoleGuard(Role.PROFESSIONAL)
  remove(@Param('id') id: string) {
    return this.professionalsService.remove(id);
  }
}
