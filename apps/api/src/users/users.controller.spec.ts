import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        document: '12345678900',
        phone: '11999999999',
      } as CreateUserDto;

      const createdUser = { id: '1', ...dto };
      mockService.create.mockResolvedValue(createdUser);

      expect(await controller.create(dto)).toEqual(createdUser);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const users = [{ id: '1', name: 'John' }];
      mockService.findAll.mockResolvedValue(users);

      expect(await controller.findAll()).toEqual(users);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = { id: '1', name: 'John' };
      mockService.findOne.mockResolvedValue(user);

      expect(await controller.findOne('1')).toEqual(user);
      expect(mockService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = { name: 'Jane Doe' } as UpdateUserDto;
      const updated = { id: '1', ...dto };
      mockService.update.mockResolvedValue(updated);

      expect(await controller.update('1', dto)).toEqual(updated);
      expect(mockService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = { message: 'Usuário removido com sucesso', id: '1' };
      mockService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(mockService.remove).toHaveBeenCalledWith('1');
    });
  });
});
