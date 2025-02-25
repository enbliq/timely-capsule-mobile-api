import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { UserBehaviorService } from './user-behavior.service';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import type { UserBehaviorQueryDto } from './dtos/user-behavior-query.dto';

@ApiTags('User Behavior')
@ApiBearerAuth()
@Controller('user-behavior')
export class UserBehaviorController {
  constructor(private readonly userBehaviorService: UserBehaviorService) {}

  @Get('most-viewed-topics')
  @UseInterceptors()
  @ApiOperation({ summary: 'Get most viewed topics' })
  @ApiResponse({ status: 200, description: 'Returns the most viewed topics' })
  async getMostViewedTopics(@Query() query: UserBehaviorQueryDto) {
    return this.userBehaviorService.getMostViewedTopics(query);
  }

  @Get('frequently-revisited')
  @UseInterceptors()
  @ApiOperation({ summary: 'Get frequently revisited content' })
  @ApiResponse({
    status: 200,
    description: 'Returns the frequently revisited content',
  })
  async getFrequentlyRevisitedContent(@Query() query: UserBehaviorQueryDto) {
    return this.userBehaviorService.getFrequentlyRevisitedContent(query);
  }

  @Get('engagement-timeline')
  @ApiOperation({ summary: 'Get user engagement timeline' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user engagement timeline',
  })
  async getUserEngagementTimeline(@Query() query: UserBehaviorQueryDto) {
    return this.userBehaviorService.getUserEngagementTimeline(query);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export user actions' })
  @ApiResponse({
    status: 200,
    description: 'Returns the exported user actions',
  })
  async exportUserActions(
    @Query('format') format: 'json' | 'csv',
    @Res() res: Response,
  ) {
    const data = await this.userBehaviorService.exportUserActions(format);

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=user_actions.json',
      );
    } else {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=user_actions.csv',
      );
    }

    res.send(data);
  }

  @Get('retention-rate')
  @ApiOperation({ summary: 'Get user retention rate' })
  @ApiResponse({ status: 200, description: 'Returns the user retention rate' })
  async getUserRetentionRate(@Query('days') days: number) {
    return this.userBehaviorService.getUserRetentionRate(days);
  }
}
