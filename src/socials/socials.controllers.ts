import { Controller, Post, Delete, Get, Body, Param, Query, Request } from '@nestjs/common';
import { FollowDto, FollowResponseDto, UserDto, ActivityDto, PaginationDto } from './dto/socials.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FollowService } from './socials.service';

@ApiTags('users')
@Controller('social')
export class SocialController {
  constructor(private readonly followService: FollowService) {}

  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({ status: 201, description: 'User followed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @Post('follow')
  async followUser(
    @Request() req,
    @Body() followDto: FollowDto,
  ): Promise<FollowResponseDto> {
    return this.followService.followUser(req.user.id, followDto);
  }

  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({ status: 200, description: 'User unfollowed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID of the user to unfollow' })
  @Delete('follow/:id')
  async unfollowUser(
    @Request() req,
    @Param('id') followingId: string,
  ): Promise<void> {
    return this.followService.unfollowUser(req.user.id, followingId);
  }

  @ApiOperation({ summary: 'Get followers of a user' })
  @ApiResponse({ status: 200, description: 'Followers fetched successfully' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User ID whose followers are being fetched' })
  @Get('followers/:userId')
  async getFollowers(
    @Request() req,
    @Param('userId') userId: string,
  ): Promise<UserDto[]> {
    return this.followService.getFollowers(userId, req.user?.id);
  }

  @ApiOperation({ summary: 'Get users a specific user is following' })
  @ApiResponse({ status: 200, description: 'Following users fetched successfully' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User ID whose followings are being fetched' })
  @Get('following/:userId')
  async getFollowing(
    @Request() req,
    @Param('userId') userId: string,
  ): Promise<UserDto[]> {
    return this.followService.getFollowing(userId, req.user?.id);
  }

  @ApiOperation({ summary: 'Get recommended users to follow' })
  @ApiResponse({ status: 200, description: 'Recommended users fetched successfully' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: 'Number of recommended users to fetch', example: 10 })
  @Get('recommended')
  async getRecommendedUsers(
    @Request() req,
    @Query('limit') limit: number,
  ): Promise<UserDto[]> {
    return this.followService.getRecommendedUsers(req.user.id, limit || 10);
  }

  @ApiOperation({ summary: 'Get activity feed of the authenticated user' })
  @ApiResponse({ status: 200, description: 'Activity feed fetched successfully' })
  @Get('feed')
  async getActivityFeed(
    @Request() req,
    @Query() paginationDto: PaginationDto,
  ): Promise<ActivityDto[]> {
    return this.followService.getActivityFeed(req.user.id, paginationDto);
  }

  @ApiOperation({ summary: 'Create a social activity (post, comment, etc.)' })
  @ApiResponse({ status: 201, description: 'Activity created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  // Bonus endpoint to create activities (e.g., posts, comments)
  @Post('activity')
  async createActivity(
    @Request() req,
    @Body() activityData: { type: string; data: any },
  ): Promise<ActivityDto> {
    return this.followService.createActivity(
      req.user.id,
      activityData.type,
      activityData.data,
    );
  }
}
