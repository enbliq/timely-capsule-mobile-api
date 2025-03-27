// src/recommendations/recommendations.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

describe('RecommendationsController', () => {
  let controller: RecommendationsController;
  let service: RecommendationsService;

  beforeEach(async () => {
    const mockRecommendationsService = {
      getRecommendationsForUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationsController],
      providers: [
        {
          provide: RecommendationsService,
          useValue: mockRecommendationsService,
        },
      ],
    }).compile();

    controller = module.get<RecommendationsController>(RecommendationsController);
    service = module.get<RecommendationsService>(RecommendationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRecommendations', () => {
    it('should return an array of recommended capsules', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      const mockRequest = { user: mockUser };
      const mockCapsules = [
        { id: 1, title: 'Recommended Capsule 1' },
        { id: 2, title: 'Recommended Capsule 2' },
      ];
      
      jest.spyOn(service, 'getRecommendationsForUser').mockResolvedValue(mockCapsules);

      const result = await controller.getRecommendations(mockRequest, 5);
      
      expect(result).toBe(mockCapsules);
      expect(service.getRecommendationsForUser).toHaveBeenCalledWith(1, 5);
    });
  });
});