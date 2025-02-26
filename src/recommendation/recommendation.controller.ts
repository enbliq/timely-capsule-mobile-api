import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { Content } from '../content/entities/content.entity';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('user/:userId')
  async getRecommendationsForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<Content[]> {
    return this.recommendationService.getRecommendationsForUser(userId, limit);
  }

  @Get('user/:userId/collaborative')
  async getCollaborativeRecommendations(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<Content[]> {
    return this.recommendationService.getCollaborativeRecommendations(userId, limit);
  }
}