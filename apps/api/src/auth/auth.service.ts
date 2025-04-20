import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { z } from 'zod';
import { I18nService } from '../i18n/i18n.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterAuthDto } from './dto/register.dto';

const jwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

const authResponseSchema = z.object({
  message: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    role: z.nativeEnum(Role),
  }),
});

type JwtPayload = z.infer<typeof jwtPayloadSchema>;
type Tokens = z.infer<typeof tokensSchema>;
type AuthResponse = z.infer<typeof authResponseSchema>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  async register(data: RegisterAuthDto) {
    const { email, document, phone } = data;

    if (await this.usersService.findByEmail(email)) {
      throw new NotFoundException(
        this.i18nService.t('auth.errors.emailAlreadyExists'),
      );
    }

    if (await this.usersService.findByDocument(document)) {
      throw new NotFoundException(
        this.i18nService.t('auth.errors.documentAlreadyExists'),
      );
    }

    if (await this.usersService.findByPhone(phone)) {
      throw new NotFoundException(
        this.i18nService.t('auth.errors.phoneAlreadyExists'),
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const user = await this.usersService.create(data);

    return {
      ...user,
      message: this.i18nService.t('auth.success.register'),
    };
  }

  async authenticate(authenticateDto: AuthenticateDto): Promise<AuthResponse> {
    const { email, password } = authenticateDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('auth.errors.userNotFound'),
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        this.i18nService.t('auth.errors.invalidPassword'),
      );
    }

    const payload = jwtPayloadSchema.parse({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const tokens = await this.generateTokens(payload);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        refreshToken: await this.hashToken(tokens.refreshToken),
      },
    });

    const response = authResponseSchema.parse({
      message: this.i18nService.t('auth.success.login'),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    return response;
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const validatedPayload = jwtPayloadSchema.parse(payload);

      const user = await this.usersService.findById(validatedPayload.sub);

      if (!user) {
        throw new UnauthorizedException(
          this.i18nService.t('auth.errors.userNotFound'),
        );
      }

      const isValidToken = await this.compareTokens(
        refreshToken,
        user.refreshToken ?? null,
      );

      if (!isValidToken) {
        throw new UnauthorizedException(
          this.i18nService.t('auth.errors.invalidRefreshToken'),
        );
      }

      const newPayload = jwtPayloadSchema.parse({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      const tokens = await this.generateTokens(newPayload);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          refreshToken: await this.hashToken(tokens.refreshToken),
        },
      });

      return tokensSchema.parse(tokens);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (error instanceof z.ZodError) {
        throw new UnauthorizedException(
          this.i18nService.t('auth.errors.invalidToken'),
        );
      }

      if ((error as any)?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          this.i18nService.t('auth.errors.invalidToken'),
        );
      }

      if ((error as any)?.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          this.i18nService.t('auth.errors.expiredToken'),
        );
      }

      console.error('Erro ao refreshar token:', error);
      throw new UnauthorizedException(
        this.i18nService.t('auth.errors.refreshError'),
      );
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { password, email } = forgotPasswordDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('auth.errors.userNotFound', { email }),
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await this.usersService.update(user.id, {
      password: hashedPassword,
      email,
    });

    return {
      ...updatedUser,
      message: this.i18nService.t('auth.success.passwordReset'),
    };
  }

  private async generateTokens(payload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: payload.sub },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return tokensSchema.parse({
      accessToken,
      refreshToken,
    });
  }

  private async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  private async compareTokens(
    token: string,
    hashedToken: string | null,
  ): Promise<boolean> {
    if (!hashedToken) return false;
    return bcrypt.compare(token, hashedToken);
  }
}
