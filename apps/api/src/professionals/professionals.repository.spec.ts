import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalsRepository } from './professionals.repository';

const mockPrisma = {
  professional: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  schedule: {
    findMany: jest.fn(),
  },
  appointment: {
    findMany: jest.fn(),
  },
};

describe('ProfessionalsRepository', () => {
  let repository: ProfessionalsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessionalsRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<ProfessionalsRepository>(ProfessionalsRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.professional.create with user connection', async () => {
      const dto = {
        businessName: 'Test Biz',
        specialties: ['Haircut', 'Color'],
        profileDescription: 'desc',
      } satisfies CreateProfessionalDto;

      const userId = 'user-123';
      const expected = {
        ...dto,
        user: { connect: { id: userId } },
      };

      await repository.create(dto, userId);

      expect(mockPrisma.professional.create).toHaveBeenCalledWith({
        data: expected,
      });
    });
  });

  it('should call prisma.professional.findMany on findAll', async () => {
    await repository.findAll();
    expect(mockPrisma.professional.findMany).toHaveBeenCalledWith({
      include: { user: true },
    });
  });

  it('should call prisma.professional.findUnique on findById', async () => {
    await repository.findById('123');
    expect(mockPrisma.professional.findUnique).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('should call prisma.professional.findUnique with user on findWithUser', async () => {
    await repository.findWithUser('123');
    expect(mockPrisma.professional.findUnique).toHaveBeenCalledWith({
      where: { id: '123' },
      include: { user: true },
    });
  });

  it('should call prisma.schedule.findMany on findScheduleByProfessionalId', async () => {
    await repository.findScheduleByProfessionalId('456');
    expect(mockPrisma.schedule.findMany).toHaveBeenCalledWith({
      where: { professionalId: '456', isAvailable: true },
      orderBy: { dateTime: 'asc' },
    });
  });

  it('should call prisma.appointment.findMany on findRatingsByProfessionalId', async () => {
    await repository.findRatingsByProfessionalId('789');
    expect(mockPrisma.appointment.findMany).toHaveBeenCalledWith({
      where: {
        professionalId: '789',
        status: 'CONFIRMED',
        NOT: { rating: null },
      },
      select: {
        rating: true,
        client: { select: { name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  });

  describe('update', () => {
    it('should call prisma.professional.update on update', async () => {
      const dto: UpdateProfessionalDto = {
        businessName: 'New Biz',
        specialties: ['Barber', 'Style'],
        profileDescription: 'Updated profile',
      };

      await repository.update('123', dto);

      expect(mockPrisma.professional.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: dto,
      });
    });
  });

  it('should call prisma.professional.delete on delete', async () => {
    await repository.delete('123');
    expect(mockPrisma.professional.delete).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });
});
