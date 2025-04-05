import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users/users.repository';
import { AuthService } from './auth.service';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  document: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: {
    findByEmail: jest.Mock;
    findByDocument: jest.Mock;
    findByPhone: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };

  const mockUsersRepository = () => ({
    findByEmail: jest.fn(),
    findByDocument: jest.fn(),
    findByPhone: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  });

  const generateMockUser = (overrides: Partial<User> = {}): User => ({
    id: 'user-uuid',
    email: 'test@example.com',
    name: 'Test User',
    document: '12345678900',
    phone: '11999999999',
    password: 'hashedPassword',
    role: Role.CLIENT,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useFactory: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    jest.clearAllMocks();
  });

  describe('register', () => {
    const data = {
      email: 'test@example.com',
      document: '12345678900',
      phone: '11999999999',
      name: 'Test User',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('should register a new user', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByDocument.mockResolvedValue(null);
      usersRepository.findByPhone.mockResolvedValue(null);

      const mockUser = generateMockUser();
      usersRepository.create.mockResolvedValue(mockUser);

      const result = await service.register(data);

      expect(usersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: data.email,
        }),
      );
      expect(result).toHaveProperty('id');
    });

    it('should throw if email exists', async () => {
      usersRepository.findByEmail.mockResolvedValue(generateMockUser());
      await expect(service.register(data)).rejects.toThrow(NotFoundException);
    });

    it('should throw if document exists', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByDocument.mockResolvedValue(generateMockUser());
      await expect(service.register(data)).rejects.toThrow(NotFoundException);
    });

    it('should throw if phone exists', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByDocument.mockResolvedValue(null);
      usersRepository.findByPhone.mockResolvedValue(generateMockUser());
      await expect(service.register(data)).rejects.toThrow(NotFoundException);
    });
  });

  describe('authenticate', () => {
    it('should authenticate valid credentials', async () => {
      const password = 'securePass';
      const hashedPassword = await bcrypt.hash(password, 10);
      const mockUser = generateMockUser({
        email: 'auth@example.com',
        password: hashedPassword,
      });

      usersRepository.findByEmail.mockResolvedValue(mockUser);
      const result = await service.authenticate({
        email: mockUser.email,
        password,
      });

      expect(result.user.email).toBe(mockUser.email);
      expect(result.message).toBe('Login realizado com sucesso');
    });

    it('should throw if user not found', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      await expect(
        service.authenticate({ email: 'no@user.com', password: '123' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if password invalid', async () => {
      const wrongPasswordHash = await bcrypt.hash('wrongPass', 10);
      const mockUser = generateMockUser({
        email: 'auth@example.com',
        password: wrongPasswordHash,
      });
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.authenticate({ email: mockUser.email, password: 'incorrect' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    const email = 'reset@example.com';
    const password = 'newPassword123';

    it('should reset password if user exists', async () => {
      const user = generateMockUser({ email });
      usersRepository.findByEmail.mockResolvedValue(user);
      usersRepository.update.mockResolvedValue({ ...user, password });

      const result = await service.forgotPassword({
        email,
        password,
        confirmPassword: password,
      });

      expect(usersRepository.update).toHaveBeenCalledWith(
        user.id,
        expect.objectContaining({
          password: expect.stringMatching(/^.+$/) as unknown as string,
        }),
      );
      expect(result).toHaveProperty('password');
    });

    it('should throw if user does not exist', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      await expect(
        service.forgotPassword({ email, password, confirmPassword: password }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
