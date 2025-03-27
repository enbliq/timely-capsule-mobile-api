// src/recommendations/recommendations.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendationsService } from './recommendation.service';
import { Capsule } from '../capsules/entities/capsule.entity';
import { UserInteraction } from '../users/entities/user-interaction.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T>(): MockRepository<T> => ({
  find: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  })),
});

describe('RecommendationsService', () => {
  let service: RecommendationsService;
  let capsuleRepository: MockRepository<Capsule>;
  let userInteractionRepository: MockRepository<UserInteraction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        {
          provide: getRepositoryToken(Capsule),
          useValue: createMockRepository<Capsule>(),
        },
        {
          provide: getRepositoryToken(UserInteraction),
          useValue: createMockRepository<UserInteraction>(),
        },
      ],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);
    capsuleRepository = module.get(getRepositoryToken(Capsule));
    userInteractionRepository = module.get(getRepositoryToken(UserInteraction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRecommendationsForUser', () => {
    it('should return popular capsules when user has no interactions', async () => {
      userInteractionRepository.find.mockResolvedValue([]);
      const mockPopularCapsules = [{ id: 1, title: 'Popular Capsule' }];
      
      const queryBuilder = capsuleRepository.createQueryBuilder();
      queryBuilder.getMany.mockResolvedValue(mockPopularCapsules);

      const result = await service.getRecommendationsForUser(1);
      expect(result).toEqual(mockPopularCapsules);
      expect(userInteractionRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['capsule'],
      });
    });

    it('should return similar capsules based on user interactions', async () => {
      // Mock user interactions
      userInteractionRepository.find.mockResolvedValue([
        { userId: 1, capsuleId: 101 },
        { userId: 1, capsuleId: 102 },
      ]);

      // Mock interacted capsules with categories and tags
      capsuleRepository.find.mockResolvedValue([
        {
          id: 101,
          categories: [{ id: 1 }, { id: 2 }],
          tags: [{ id: 1 }, { id: 3 }],
        },
        {
          id: 102,
          categories: [{ id: 2 }],
          tags: [{ id: 2 }],
        },
      ]);

      // Mock similar capsules result
      const mockSimilarCapsules = [
        { id: 201, title: 'Similar Capsule 1' },
        { id: 202, title: 'Similar Capsule 2' },
      ];
      
      const queryBuilder = capsuleRepository.createQueryBuilder();
      queryBuilder.getMany.mockResolvedValue(mockSimilarCapsules);

      const result = await service.getRecommendationsForUser(1);
      expect(result).toEqual(mockSimilarCapsules);
    });
  });
});