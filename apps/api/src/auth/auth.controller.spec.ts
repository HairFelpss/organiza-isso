import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterAuthDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    authenticate: jest.fn(),
    register: jest.fn(),
    forgotPassword: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ message: 'ok', ...dto })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('authenticate', () => {
    it('should call authService.authenticate with dto and return result', async () => {
      const dto = {
        email: 'test@example.com',
        password: '123456',
      } as AuthenticateDto;

      const expectedResult = { token: 'jwt-token' };
      mockAuthService.authenticate.mockResolvedValue(expectedResult);

      const act = () => controller.authenticate(dto);

      await expect(act()).resolves.toEqual(expectedResult);
      expect(mockAuthService.authenticate).toHaveBeenCalledWith(dto);
    });

    it('should throw if authService.authenticate throws', async () => {
      const dto = {
        email: 'fail@example.com',
        password: 'wrong',
      } as AuthenticateDto;
      mockAuthService.authenticate.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(() => controller.authenticate(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should call authService.register with dto and return result', async () => {
      const dto = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password',
        confirmPassword: 'password',
        phone: '11999999999',
        document: '12345678900',
      } as RegisterAuthDto;

      const expectedResult = { id: 'user-id', email: dto.email };
      mockAuthService.register.mockResolvedValue(expectedResult);

      const act = () => controller.register(dto);

      await expect(act()).resolves.toEqual(expectedResult);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });

    it('should throw if authService.register throws', async () => {
      const dto = {
        email: 'exists@example.com',
        name: 'User',
        password: 'password',
        confirmPassword: 'password',
        phone: '11999999999',
        document: '00000000000',
      } as RegisterAuthDto;

      mockAuthService.register.mockRejectedValue(
        new Error('Email already used'),
      );

      await expect(() => controller.register(dto)).rejects.toThrow(
        'Email already used',
      );
    });
  });

  describe('forgotPassword', () => {
    it('should call authService.forgotPassword with dto and return result', async () => {
      const dto = {
        email: 'forgot@example.com',
        password: 'newpassword',
        confirmPassword: 'newpassword',
      } as ForgotPasswordDto;

      const expectedResult = { id: 'user-id', email: dto.email };
      mockAuthService.forgotPassword.mockResolvedValue(expectedResult);

      const act = () => controller.forgotPassword(dto);

      await expect(act()).resolves.toEqual(expectedResult);
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(dto);
    });

    it('should throw if authService.forgotPassword throws', async () => {
      const dto = {
        email: 'invalid@example.com',
        password: '123456',
        confirmPassword: '123456',
      } as ForgotPasswordDto;

      mockAuthService.forgotPassword.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(() => controller.forgotPassword(dto)).rejects.toThrow(
        'User not found',
      );
    });
  });
});
