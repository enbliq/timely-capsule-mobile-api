import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Capsule } from 'src/capsule/entities/capsule.entity';
import { PaginationService } from 'src/common/pagination/pagination.service';

describe('AdminService', () => {
  let service: AdminService;
  let repo: Repository<Capsule>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        PaginationService,
        {
          provide: getRepositoryToken(Capsule),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    repo = module.get<Repository<Capsule>>(getRepositoryToken(Capsule));
  });

  it('should filter unlocked capsules', async () => {
    jest.spyOn(repo, 'createQueryBuilder').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      getMany: jest
        .fn()
        .mockResolvedValue([{ id: 1, unlockAt: new Date('2024-01-01') }]),
      getCount: jest.fn().mockResolvedValue(1),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
    } as any);

    const result = await service.findCapsulesByUnlockStatus(true);
    expect(result.data).toEqual([{ id: 1, unlockAt: new Date('2024-01-01') }]);
  });

  it('should return all capsules if no filter is applied', async () => {
    jest.spyOn(repo, 'createQueryBuilder').mockReturnValue({
      getMany: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
      getCount: jest.fn().mockResolvedValue(2),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
    } as any);

    const result = await service.findCapsulesByUnlockStatus(undefined);
    expect(result.data.length).toBe(2);
  });
});
