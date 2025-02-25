import { Controller, Get, Param } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';

@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  async getLogs() {
    return this.activityLogService.getLogs();
  }

  @Get(':userId')
  async getUserLogs(@Param('userId') userId: string) {
    return this.activityLogService.getUserLogs(userId);
  }
}
