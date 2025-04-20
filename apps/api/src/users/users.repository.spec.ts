import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    findByEmail: jest.fn(),
    findByDocument: jest.fn(),
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
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const newUser = {
      email: 'test@example.com',
      document: '12345678900',
      phone: '11999999999',
      name: 'Test User',
      password: 'password123',
    };

    it('should create a new user', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.findByDocument.mockResolvedValue(null);
      mockUsersRepository.findByPhone.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue({ id: 'uuid', ...newUser });

      const result = await service.create(newUser);

      expect(result).toHaveProperty('id');
      expect(mockUsersRepository.create).toHaveBeenCalledWith(newUser);
    });

    it('should throw if email is taken', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue({ id: 'uuid' });

      await expect(service.create(newUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw if document is taken', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.findByDocument.mockResolvedValue({ id: 'uuid' });

      await expect(service.create(newUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw if phone is taken', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.findByDocument.mockResolvedValue(null);
      mockUsersRepository.findByPhone.mockResolvedValue({ id: 'uuid' });

      await expect(service.create(newUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: '1' }, { id: '2' }];
      mockUsersRepository.findAll.mockResolvedValue(users);
      expect(await service.findAll()).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 'uuid', name: 'User' };
      mockUsersRepository.findById.mockResolvedValue(user);

      const result = await service.findById('uuid');
      expect(result).toEqual(user);
    });

    it('should throw if user not found', async () => {
      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(service.findById('uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = { name: 'Updated Name' };
      const existing = { id: 'uuid', name: 'User' };
      const updated = { ...existing, ...updateData };

      mockUsersRepository.findById.mockResolvedValue(existing);
      mockUsersRepository.update.mockResolvedValue(updated);

      const result = await service.update('uuid', updateData);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const user = { id: 'uuid' };
      mockUsersRepository.findById.mockResolvedValue(user);

      const result = await service.remove('uuid');
      expect(result).toEqual({
        message: 'Usuário removido com sucesso',
        id: 'uuid',
      });
    });
  });
});
