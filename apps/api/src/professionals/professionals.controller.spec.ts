import { Test, TestingModule } from '@nestjs/testing';
import { CreateProfessionalDto, User } from '@organiza-isso-app/zod';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsService } from './professionals.service';

describe('ProfessionalsController', () => {
  let controller: ProfessionalsController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    getPrivateProfile: jest.fn(),
    getSchedule: jest.fn(),
    getRatings: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalsController],
      providers: [
        {
          provide: ProfessionalsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProfessionalsController>(ProfessionalsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto and return result', async () => {
      const dto = {
        businessName: 'Test',
        specialties: ['Hair'],
      } satisfies CreateProfessionalDto;

      const mockUser: Pick<User, 'id'> = { id: 'user-123' };

      const result = { id: '123', ...dto };
      mockService.create.mockResolvedValue(result);

      const act = () => controller.create(dto, mockUser);

      await expect(act()).resolves.toEqual(result);
      expect(mockService.create).toHaveBeenCalledWith(dto, mockUser.id);
    });
  });

  describe('findAll', () => {
    it('should return list of professionals', async () => {
      const professionals = [{ id: '1' }, { id: '2' }];
      mockService.findAll.mockResolvedValue(professionals);

      expect(await controller.findAll()).toEqual(professionals);
    });
  });

  describe('findOne', () => {
    it('should return a single professional by id', async () => {
      const professional = { id: '1' };
      mockService.findOne.mockResolvedValue(professional);

      expect(await controller.findOne('1')).toEqual(professional);
    });
  });

  describe('getPrivateProfile', () => {
    it('should return the private profile', async () => {
      const profile = { id: '1', user: { name: 'Test' } };
      mockService.getPrivateProfile.mockResolvedValue(profile);

      expect(await controller.getPrivateProfile('1')).toEqual(profile);
    });
  });

  describe('getSchedule', () => {
    it('should return the schedule for a professional', async () => {
      const schedule = [{ dateTime: new Date() }];
      mockService.getSchedule.mockResolvedValue(schedule);

      expect(await controller.getSchedule('1')).toEqual(schedule);
    });
  });

  describe('getRatings', () => {
    it('should return the ratings for a professional', async () => {
      const ratings = [{ rating: 5 }];
      mockService.getRatings.mockResolvedValue(ratings);

      expect(await controller.getRatings('1')).toEqual(ratings);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto = { businessName: 'Updated Name' };
      const updated = { id: '1', ...dto };
      mockService.update.mockResolvedValue(updated);

      const act = () => controller.update('1', dto);

      await expect(act()).resolves.toEqual(updated);
      expect(mockService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      const deleted = { message: 'Deleted', id: '1' };
      mockService.remove.mockResolvedValue(deleted);

      const act = () => controller.remove('1');

      await expect(act()).resolves.toEqual(deleted);
      expect(mockService.remove).toHaveBeenCalledWith('1');
    });
  });
});
