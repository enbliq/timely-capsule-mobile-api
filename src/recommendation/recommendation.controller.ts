import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { Content } from '../content/entities/content.entity';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @ApiOperation({ summary: 'Get recommendations for a user' })
  @ApiResponse({ status: 200, description: 'Recommendations retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid user ID or query parameters' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'userId', type: 'number', description: 'ID of the user' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: 'Number of recommendations to fetch', example: 10 })
  @Get('user/:userId')
  async getRecommendationsForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<Content[]> {
    return this.recommendationService.getRecommendationsForUser(userId, limit);
  }

  @ApiOperation({ summary: 'Get collaborative recommendations for a user' })
  @ApiResponse({ status: 200, description: 'Collaborative recommendations retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid user ID or query parameters' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'userId', type: 'number', description: 'ID of the user' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: 'Number of recommendations to fetch', example: 10 })
  @Get('user/:userId/collaborative')
  async getCollaborativeRecommendations(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<Content[]> {
    return this.recommendationService.getCollaborativeRecommendations(userId, limit);
  }
}