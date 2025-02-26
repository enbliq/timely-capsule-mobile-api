import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserBehaviorService } from './user-behavior.service';
import { UserAction } from './entities/user-action.entity';
import { ConfigService } from '@nestjs/config';
import type { Repository } from 'typeorm';

describe('UserBehaviorService', () => {
  let service: UserBehaviorService;
  let mockRepository: jest.Mocked<Repository<UserAction>>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    mockRepository = {
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      })),
      find: jest.fn(),
    } as any;

    mockConfigService = {
      get: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserBehaviorService,
        {
          provide: getRepositoryToken(UserAction),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UserBehaviorService>(UserBehaviorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMostViewedTopics', () => {
    it('should return an array of most viewed topics', async () => {
      const mockResult = [{ topicId: '1', viewCount: '10' }];
      mockRepository.createQueryBuilder();

      const result = await service.getMostViewedTopics({ limit: 10 });
      expect(result).toEqual(mockResult);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getFrequentlyRevisitedContent', () => {
    it('should return an array of frequently revisited content', async () => {
      const mockResult = [
        { contentId: '1', uniqueUsers: '5', totalViews: '15' },
      ];
      mockRepository.createQueryBuilder();

      const result = await service.getFrequentlyRevisitedContent({ limit: 10 });
      expect(result).toEqual(mockResult);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getUserEngagementTimeline', () => {
    it('should return user engagement timeline', async () => {
      const mockResult = [{ date: '2023-01-01', actionCount: '100' }];
      mockRepository.createQueryBuilder();

      const result = await service.getUserEngagementTimeline({
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      });
      expect(result).toEqual(mockResult);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw BadRequestException if startDate or endDate is missing', async () => {
      await expect(service.getUserEngagementTimeline({})).rejects.toThrow(
        'Both startDate and endDate are required',
      );
    });
  });

  describe('exportUserActions', () => {
    it('should export user actions as JSON', async () => {
      const mockActions = [
        {
          id: 1,
          userId: 1,
          action: 'view',
          targetId: '1',
          targetType: 'topic',
          timestamp: new Date(),
        },
      ];
      mockRepository.find.mockResolvedValue(mockActions);

      const result = await service.exportUserActions('json');
      expect(result).toEqual(JSON.stringify(mockActions));
    });

    it('should export user actions as CSV', async () => {
      const mockActions = [
        {
          id: 1,
          userId: 1,
          action: 'view',
          targetId: '1',
          targetType: 'topic',
          timestamp: new Date(),
        },
      ];
      mockRepository.find.mockResolvedValue(mockActions);

      const result = await service.exportUserActions('csv');
      expect(result).toContain(
        'id,userId,action,targetId,targetType,timestamp',
      );
      expect(result).toContain('1,1,view,1,topic');
    });

    it('should throw NotFoundException if no actions found', async () => {
      mockRepository.find.mockResolvedValue([]);

      await expect(service.exportUserActions('json')).rejects.toThrow(
        'No user actions found',
      );
    });
  });

  describe('getUserRetentionRate', () => {
    it('should return user retention rate', async () => {
      const mockResult = [{ retentionRate: '75.5' }];
      mockRepository.createQueryBuilder();

      const result = await service.getUserRetentionRate(30);
      expect(result).toEqual(75.5);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getUserActivitySummary', () => {
    it('should return user activity summary', async () => {
      const mockActions = [
        {
          userId: 1,
          action: 'view',
          targetId: '1',
          targetType: 'topic',
          timestamp: new Date('2023-01-01'),
        },
        {
          userId: 1,
          action: 'like',
          targetId: '2',
          targetType: 'post',
          timestamp: new Date('2023-01-02'),
        },
      ];

      const result = await service.getUserActivitySummary(
        1,
        '2023-01-01',
        '2023-01-31',
      );
      expect(result.totalActions).toEqual(2);
      expect(result.actionTypes).toHaveProperty('view', 1);
      expect(result.actionTypes).toHaveProperty('like', 1);
      expect(result.mostActiveDay).toBeDefined();
      expect(result.leastActiveDay).toBeDefined();
    });
  });

  describe('getContentPopularityTrend', () => {
    it('should return content popularity trend', async () => {
      const mockResult = [{ date: '2023-01-01', viewCount: '10' }];
      mockRepository.createQueryBuilder();

      const result = await service.getContentPopularityTrend('1', 30);
      expect(result).toEqual(mockResult);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getUserSegmentation', () => {
    it('should return user segmentation data', async () => {
      const mockResult = [
        { userId: '1', actionCount: '50' },
        { userId: '2', actionCount: '10' },
        { userId: '3', actionCount: '30' },
      ];
      mockRepository.createQueryBuilder();

      const result = await service.getUserSegmentation();
      expect(result.totalUsers).toEqual(3);
      expect(result.averageActions).toBeCloseTo(30);
      expect(result.segments).toBeDefined();
      expect(result.segmentPercentages).toBeDefined();
    });
  });

  describe('getSessionDurationDistribution', () => {
    it('should return session duration distribution', async () => {
      const mockResult = [
        { userId: '1', timestamp: new Date('2023-01-01T10:00:00') },
        { userId: '1', timestamp: new Date('2023-01-01T10:10:00') },
        { userId: '2', timestamp: new Date('2023-01-01T11:00:00') },
        { userId: '2', timestamp: new Date('2023-01-01T11:20:00') },
      ];
      mockRepository.createQueryBuilder();

      const result = await service.getSessionDurationDistribution();
      expect(result).toHaveProperty('0-5 min');
      expect(result).toHaveProperty('5-15 min');
      expect(result).toHaveProperty('15-30 min');
      expect(result).toHaveProperty('30+ min');
    });
  });
});
