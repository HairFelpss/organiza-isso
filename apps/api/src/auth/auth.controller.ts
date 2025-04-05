import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthService } from './auth.service';
import { RoleGuard } from './decorators/role.decorator';
import { AuthenticateDto } from './dto/authenticate.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('private')
  getPrivate() {
    return { message: 'Autenticado com sucesso!' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RoleGuard(Role.ADMIN) // 👈 exige que o usuário tenha o role ADMIN
  @Get('admin-only')
  getAdminOnly() {
    return { message: 'Somente administradores podem acessar isso' };
  }

  @UsePipes(new ZodValidationPipe(AuthenticateDto.schema))
  @Post('authenticate')
  authenticate(@Body() authenticateDto: AuthenticateDto) {
    return this.authService.authenticate(authenticateDto);
  }

  @UsePipes(new ZodValidationPipe(RegisterAuthDto.schema))
  @Post('register')
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @UsePipes(new ZodValidationPipe(ForgotPasswordDto.schema))
  @Patch('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
}
