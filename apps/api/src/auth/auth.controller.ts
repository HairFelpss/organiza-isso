import { Body, Controller, Patch, Post, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterAuthDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ZodValidationPipe(AuthenticateDto.schema)) // validação específica
  @Post('authenticate')
  authenticate(@Body() authenticateDto: AuthenticateDto) {
    return this.authService.authenticate(authenticateDto);
  }

  @UsePipes(new ZodValidationPipe(RegisterAuthDto.schema)) // validação específica
  @Post('register')
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @UsePipes(new ZodValidationPipe(ForgotPasswordDto.schema)) // validação específica
  @Patch('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
}
