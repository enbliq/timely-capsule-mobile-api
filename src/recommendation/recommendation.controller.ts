// src/recommendations/recommendations.controller.ts
import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RecommendationsService } from './recommendations.service';
import { Capsule } from '../capsules/entities/capsule.entity';

@ApiTags('recommendations')
@Controller('capsules')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personalized capsule recommendations' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of recommended capsules',
    type: [Capsule],
  })
  async getRecommendations(
    @Request() req,
    @Query('limit') limit = 10,
  ): Promise<Capsule[]> {
    return this.recommendationsService.getRecommendationsForUser(
      req.user.id,
      limit,
    );
  }
}