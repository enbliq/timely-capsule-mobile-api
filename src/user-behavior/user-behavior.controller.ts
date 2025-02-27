import {
  Controller,
  Get,
  Query,
  Res,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import type { UserBehaviorService } from './user-behavior.service';
import type { Response } from 'express';
// import {
//   ApiBearerAuth,
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiParam,
// } from '@nestjs/swagger';
import type { UserBehaviorQueryDto } from './dtos/user-behavior-query.dto';

// @ApiTags('User Behavior')
// @ApiBearerAuth()
@Controller('user-behavior')
export class UserBehaviorController {
  constructor(private readonly userBehaviorService: UserBehaviorService) {}

  @Get('most-viewed-topics')
  @UseInterceptors()
  // @ApiOperation({ summary: 'Get most viewed topics' })
  // @ApiResponse({ status: 200, description: 'Returns the most viewed topics' })
  async getMostViewedTopics(@Query() query: UserBehaviorQueryDto) {
    return this.userBehaviorService.getMostViewedTopics(query);
  }

  @Get('frequently-revisited')
  @UseInterceptors()
  // // @ApiOperation({ summary: 'Get frequently revisited content' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the frequently revisited content',
  // })
  async getFrequentlyRevisitedContent(@Query() query: UserBehaviorQueryDto) {
    return this.userBehaviorService.getFrequentlyRevisitedContent(query);
  }

  @Get('engagement-timeline')
  // @ApiOperation({ summary: 'Get user engagement timeline' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the user engagement timeline',
  // })
  async getUserEngagementTimeline(@Query() query: UserBehaviorQueryDto) {
    return this.userBehaviorService.getUserEngagementTimeline(query);
  }

  @Get('export')
  // @ApiOperation({ summary: 'Export user actions' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the exported user actions',
  // })
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
  // @ApiOperation({ summary: 'Get user retention rate' })
  // @ApiResponse({ status: 200, description: 'Returns the user retention rate' })
  // async getUserRetentionRate(@Query('days') days: number) {
  //   return this.userBehaviorService.getUserRetentionRate(days);
  // }

  @Get('user-activity-summary/:userId')
  // @ApiOperation({ summary: 'Get user activity summary' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the user activity summary',
  // })
  // @ApiParam({ name: 'userId', type: 'number' })
  async getUserActivitySummary(
    @Param('userId') userId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.userBehaviorService.getUserActivitySummary(
      userId,
      startDate,
      endDate,
    );
  }

  @Get('content-popularity-trend/:contentId')
  // @ApiOperation({ summary: 'Get content popularity trend' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the content popularity trend',
  // })
  // @ApiParam({ name: 'contentId', type: 'string' })
  async getContentPopularityTrend(
    @Param('contentId') contentId: string,
    @Query('days') days: number,
  ) {
    return this.userBehaviorService.getContentPopularityTrend(contentId, days);
  }

  @Get('user-segmentation')
  // @ApiOperation({ summary: 'Get user segmentation' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the user segmentation data',
  // })
  async getUserSegmentation() {
    return this.userBehaviorService.getUserSegmentation();
  }

  @Get('session-duration-distribution')
  // @ApiOperation({ summary: 'Get session duration distribution' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the session duration distribution',
  // })
  async getSessionDurationDistribution() {
    return this.userBehaviorService.getSessionDurationDistribution();
  }
}
