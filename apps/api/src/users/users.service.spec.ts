// users.service.spec.ts
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  const mockRepo = {
    findByEmail: jest.fn(),
    findByCpf: jest.fn(),
    findByPhone: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const newUser = {
      email: 'test@example.com',
      cpf: '12345678900',
      phone: '11999999999',
      name: 'Test User',
      password: 'password123',
      role: Role.CLIENT,
    };

    it('should create a new user', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.findByCpf.mockResolvedValue(null);
      mockRepo.findByPhone.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue({ id: 'uuid', ...newUser });

      const result = await service.create(newUser);
      expect(result).toHaveProperty('id');
      expect(mockRepo.create).toHaveBeenCalledWith(newUser);
    });

    it('should throw if email is taken', async () => {
      mockRepo.findByEmail.mockResolvedValue({ id: 'uuid' });

      await expect(service.create(newUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw if CPF is taken', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.findByCpf.mockResolvedValue({ id: 'uuid' });

      await expect(service.create(newUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw if phone is taken', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.findByCpf.mockResolvedValue(null);
      mockRepo.findByPhone.mockResolvedValue({ id: 'uuid' });

      await expect(service.create(newUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: 'uuid', name: 'User' };
      mockRepo.findById.mockResolvedValue(mockUser);

      const result = await service.findOne('uuid');
      expect(result).toEqual(mockUser);
    });

    it('should throw if user not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.findOne('uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const update = { name: 'Updated' };
      const existing = { id: 'uuid', name: 'Old' };
      const updated = { ...existing, ...update };

      mockRepo.findById.mockResolvedValue(existing);
      mockRepo.update.mockResolvedValue(updated);

      const result = await service.update('uuid', update);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const user = { id: 'uuid' };
      mockRepo.findById.mockResolvedValue(user);
      mockRepo.delete.mockResolvedValue(user);

      const result = await service.remove('uuid');
      expect(result).toEqual({
        message: 'Usuário removido com sucesso',
        id: 'uuid',
      });
    });
  });
});
