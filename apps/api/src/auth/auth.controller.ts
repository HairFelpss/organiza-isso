import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';
import { I18nService } from '../i18n/i18n.service';
import { AuthService } from './auth.service';
import { Cookies, CookiesFromRequest } from './decorators/cookies.decorator';
import {
  AuthenticatedUser,
  CurrentUser,
} from './decorators/current-user.decorator';
import { RoleGuard } from './decorators/role.decorator';
import { AuthenticateDto } from './dto/authenticate.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18nService: I18nService,
  ) {}

  @Post('authenticate')
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiBody({ type: AuthenticateDto })
  @ApiResponse({
    status: 200,
    description: 'User authenticated successfully',
    schema: {
      example: {
        message: 'Login successful',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 'clh2x0f4h0000qwrjd0kg1q1q',
          email: 'john@example.com',
          name: 'John Doe',
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        message: 'Invalid password',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message: 'User not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @UsePipes(new ZodValidationPipe(AuthenticateDto.schema))
  async authenticate(
    @Body() authenticateDto: AuthenticateDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.authenticate(authenticateDto);

    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    const { refreshToken, ...authResponse } = result;

    return authResponse;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      example: {
        message: 'Logout successful',
      },
    },
  })
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    return {
      message: this.i18nService.t('auth.success.logout'),
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterAuthDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        message: 'Registration successful',
        user: {
          id: 'clh2x0f4h0000qwrjd0kg1q1q',
          email: 'john@example.com',
          name: 'John Doe',
          role: 'USER',
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
  @UsePipes(new ZodValidationPipe(RegisterAuthDto.schema))
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'O refreshToken é enviado via cookie httpOnly. Para testar este endpoint, use uma ferramenta como Postman ou faça login primeiro para receber o cookie.',
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing refresh token',
    schema: {
      example: {
        message: 'Refresh token not found',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  async refresh(
    @Cookies('refreshToken') refreshToken: string,
    @Res() response: Response,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException(
        this.i18nService.t('auth.errors.refreshTokenNotFound'),
      );
    }

    const tokens = await this.authService.refresh(refreshToken);

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return { accessToken: tokens.accessToken };
  }

  @Patch('forgot-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    schema: {
      example: {
        message: 'Password reset successful',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message: 'User not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @UsePipes(new ZodValidationPipe(ForgotPasswordDto.schema))
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('debug-cookies')
  @ApiOperation({ summary: 'Debug cookies (Development only)' })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Current cookies',
    schema: {
      example: {
        refreshToken: 'token...',
        // other cookies
      },
    },
  })
  debugCookies(@Cookies() cookies: CookiesFromRequest): CookiesFromRequest {
    return cookies;
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User profile',
    schema: {
      example: {
        id: 'clh2x0f4h0000qwrjd0kg1q1q',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'USER',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @Get('private')
  @ApiOperation({ summary: 'Protected route example' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Access granted',
    schema: {
      example: {
        message: 'Successfully authenticated',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  getPrivate() {
    return {
      message: this.i18nService.t('auth.success.authenticated'),
    };
  }

  @Get('admin-only')
  @ApiOperation({ summary: 'Admin only route' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Admin access granted',
    schema: {
      example: {
        message: 'Only administrators can access this',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not an admin',
    schema: {
      example: {
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RoleGuard(Role.ADMIN)
  getAdminOnly() {
    return {
      message: this.i18nService.t('auth.success.adminOnly'),
    };
  }
}
