import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { ProfessionalsRepository } from './professionals.repository';
import { ProfessionalsService } from './professionals.service';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findWithUser: jest.fn(),
  findScheduleByProfessionalId: jest.fn(),
  findRatingsByProfessionalId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ProfessionalsService', () => {
  let service: ProfessionalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessionalsService,
        {
          provide: ProfessionalsRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ProfessionalsService>(ProfessionalsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a professional', async () => {
    const dto = {
      businessName: 'Test',
      specialties: ['Hair'],
    } satisfies CreateProfessionalDto;

    const userId = '1';

    const expected = { id: '123', ...dto, userId };
    mockRepo.create.mockResolvedValue(expected);

    const result = await service.create(dto, userId);
    expect(result).toEqual(expected);
    expect(mockRepo.create).toHaveBeenCalledWith(dto, userId);
  });

  it('should find all professionals', async () => {
    const list = [{ id: '1' }];
    mockRepo.findAll.mockResolvedValue(list);
    const result = await service.findAll();
    expect(result).toEqual(list);
  });

  it('should find one by id', async () => {
    mockRepo.findById.mockResolvedValue({ id: '1' });
    const result = await service.findOne('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should throw if professional not found (findOne)', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
  });

  it('should return private profile', async () => {
    mockRepo.findWithUser.mockResolvedValue({ id: '1', user: {} });
    const result = await service.getPrivateProfile('1');
    expect(result).toEqual({ id: '1', user: {} });
  });

  it('should throw if profile not found', async () => {
    mockRepo.findWithUser.mockResolvedValue(null);
    await expect(service.getPrivateProfile('2')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return schedule list', async () => {
    const mockSchedule = [{ dateTime: new Date() }];
    mockRepo.findScheduleByProfessionalId.mockResolvedValue(mockSchedule);
    const result = await service.getSchedule('1');
    expect(result).toEqual(mockSchedule);
  });

  it('should throw if schedule is empty', async () => {
    mockRepo.findScheduleByProfessionalId.mockResolvedValue([]);
    await expect(service.getSchedule('2')).rejects.toThrow(NotFoundException);
  });

  it('should return ratings', async () => {
    const ratings = [{ rating: 5 }];
    mockRepo.findRatingsByProfessionalId.mockResolvedValue(ratings);
    const result = await service.getRatings('1');
    expect(result).toEqual(ratings);
  });

  it('should update a professional', async () => {
    mockRepo.findById.mockResolvedValue({ id: '1' });
    const dto = { businessName: 'New' };
    await service.update('1', dto as any);
    expect(mockRepo.update).toHaveBeenCalledWith('1', dto);
  });

  it('should throw if updating nonexistent professional', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.update('2', {} as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete a professional', async () => {
    mockRepo.findById.mockResolvedValue({ id: '1' });
    await service.remove('1');
    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });

  it('should throw if deleting nonexistent professional', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.remove('2')).rejects.toThrow(NotFoundException);
  });
});
