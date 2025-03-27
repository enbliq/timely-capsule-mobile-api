import { Controller, Get, Param } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('activity-log')
@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @ApiOperation({ summary: 'Retrieve all activity logs' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved activity logs' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get()
  async getLogs() {
    return this.activityLogService.getLogs();
  }

  @ApiOperation({ summary: 'Retrieve activity logs for a specific user' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved user activity logs' })
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User ID to fetch logs for' })
  @Get(':userId')
  async getUserLogs(@Param('userId') userId: string) {
    return this.activityLogService.getUserLogs(userId);
  }
}
