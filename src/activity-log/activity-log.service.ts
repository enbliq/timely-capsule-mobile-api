import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async logActivity(userId: string, action: string, ipAddress: string) {
    const activity = this.activityLogRepository.create({
      userId,
      action,
      ipAddress,
    });
    return await this.activityLogRepository.save(activity);
  }

  async getLogs() {
    return await this.activityLogRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  async getUserLogs(userId: string) {
    return await this.activityLogRepository.find({ where: { userId } });
  }
}
