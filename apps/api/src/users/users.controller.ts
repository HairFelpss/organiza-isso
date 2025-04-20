import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        message: 'User created successfully',
        user: {
          id: 'uuid',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'CLIENT',
          phone: '+5511999999999',
          document: '12345678900',
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
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    schema: {
      example: {
        message: 'Email already registered',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  @UsePipes(new ZodValidationPipe(CreateUserDto.schema))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all users with pagination and filters' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name or email',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: Role,
    description: 'Filter by role',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ['name', 'email', 'createdAt'],
    description: 'Order by field',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Order direction',
  })
  @ApiResponse({
    status: 200,
    description: 'Users listed successfully',
    schema: {
      example: {
        message: 'Users listed successfully',
        users: [
          {
            id: 'uuid',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'CLIENT',
            phone: '+5511999999999',
            document: '12345678900',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
        metadata: {
          total: 50,
          totalPages: 5,
          currentPage: 1,
          itemsPerPage: 10,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(
    @Query(new ZodValidationPipe(FilterUserDto.schema))
    query: FilterUserDto,
  ) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'User ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    schema: {
      example: {
        message: 'User found successfully',
        user: {
          id: 'uuid',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'CLIENT',
          phone: '+5511999999999',
          document: '12345678900',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message: 'User with ID {id} not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'User ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      example: {
        message: 'User updated successfully',
        user: {
          id: 'uuid',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'CLIENT',
          phone: '+5511999999999',
          document: '12345678900',
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
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message: 'User with ID {id} not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict with existing data',
    schema: {
      example: {
        message: 'Email already registered',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  @UsePipes(new ZodValidationPipe(UpdateUserDto.schema))
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove user' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'User ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User removed successfully',
    schema: {
      example: {
        message: 'User removed successfully',
        id: 'uuid',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message: 'User with ID {id} not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.remove(id);
  }
}
