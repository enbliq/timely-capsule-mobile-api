import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type Repository, Between } from 'typeorm';
import { UserAction } from './entities/user-action.entity';
import type { ConfigService } from '@nestjs/config';
import type { UserBehaviorQueryDto } from './dtos/user-behavior-query.dto';

@Injectable()
export class UserBehaviorService {
  private readonly logger = new Logger(UserBehaviorService.name);

  constructor(
    @InjectRepository(UserAction)
    private userActionRepository: Repository<UserAction>,
    private configService: ConfigService,
  ) {}

  async getMostViewedTopics(query: UserBehaviorQueryDto): Promise<any[]> {
    this.logger.log(`Fetching most viewed topics with limit: ${query.limit}`);
    return this.userActionRepository
      .createQueryBuilder('action')
      .select('action.targetId', 'topicId')
      .addSelect('COUNT(*)', 'viewCount')
      .where('action.action = :action', { action: 'view' })
      .andWhere('action.targetType = :targetType', { targetType: 'topic' })
      .groupBy('action.targetId')
      .orderBy('viewCount', 'DESC')
      .limit(query.limit)
      .getRawMany();
  }

  async getFrequentlyRevisitedContent(
    query: UserBehaviorQueryDto,
  ): Promise<any[]> {
    this.logger.log(
      `Fetching frequently revisited content with limit: ${query.limit}`,
    );
    return this.userActionRepository
      .createQueryBuilder('action')
      .select('action.targetId', 'contentId')
      .addSelect('COUNT(DISTINCT action.userId)', 'uniqueUsers')
      .addSelect('COUNT(*)', 'totalViews')
      .where('action.action = :action', { action: 'view' })
      .groupBy('action.targetId')
      .having('COUNT(*) > 1')
      .orderBy('uniqueUsers', 'DESC')
      .addOrderBy('totalViews', 'DESC')
      .limit(query.limit)
      .getRawMany();
  }

  async getUserEngagementTimeline(query: UserBehaviorQueryDto): Promise<any[]> {
    if (!query.startDate || !query.endDate) {
      throw new BadRequestException('Both startDate and endDate are required');
    }

    this.logger.log(
      `Fetching user engagement timeline from ${query.startDate} to ${query.endDate}`,
    );
    return this.userActionRepository
      .createQueryBuilder('action')
      .select('DATE(action.timestamp)', 'date')
      .addSelect('COUNT(*)', 'actionCount')
      .where({
        timestamp: Between(new Date(query.startDate), new Date(query.endDate)),
      })
      .groupBy('DATE(action.timestamp)')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  async exportUserActions(format: 'json' | 'csv'): Promise<string> {
    this.logger.log(`Exporting user actions in ${format} format`);
    const actions = await this.userActionRepository.find();

    if (actions.length === 0) {
      throw new NotFoundException('No user actions found');
    }

    if (format === 'json') {
      return JSON.stringify(actions);
    } else {
      const header = 'id,userId,action,targetId,targetType,timestamp\n';
      const rows = actions
        .map(
          (action) =>
            `${action.id},${action.userId},${action.action},${action.targetId},${action.targetType},${action.timestamp}`,
        )
        .join('\n');
      return header + rows;
    }
  }

  async getUserRetentionRate(days: number): Promise<number> {
    this.logger.log(`Calculating user retention rate for ${days} days`);
    const retentionThreshold = new Date();
    retentionThreshold.setDate(retentionThreshold.getDate() - days);

    const [result] = await this.userActionRepository
      .createQueryBuilder('action')
      .select(
        'COUNT(DISTINCT CASE WHEN action.timestamp >= :threshold THEN action.userId END) * 100.0 / COUNT(DISTINCT action.userId)',
        'retentionRate',
      )
      .where('action.timestamp < :threshold', { threshold: retentionThreshold })
      .getRawMany();

    return Number.parseFloat(result.retentionRate);
  }

  // New methods to add more business logic

  async getUserActivitySummary(
    userId: number,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    this.logger.log(
      `Fetching activity summary for user ${userId} from ${startDate} to ${endDate}`,
    );
    const actions = await this.userActionRepository.find({
      where: {
        userId,
        timestamp: Between(new Date(startDate), new Date(endDate)),
      },
    });

    const summary = {
      totalActions: actions.length,
      actionTypes: {},
      mostActiveDay: null,
      leastActiveDay: null,
    };

    const dailyActions = {};

    actions.forEach((action) => {
      // Count action types
      summary.actionTypes[action.action] =
        (summary.actionTypes[action.action] || 0) + 1;

      // Group actions by day
      const day = action.timestamp.toISOString().split('T')[0];
      dailyActions[day] = (dailyActions[day] || 0) + 1;
    });

    if (Object.keys(dailyActions).length > 0) {
      const [mostActiveDay] = Object.entries(dailyActions).reduce(
        (max, entry) => (entry[1] > max[1] ? entry : max),
      );
      const [leastActiveDay] = Object.entries(dailyActions).reduce(
        (min, entry) => (entry[1] < min[1] ? entry : min),
      );

      summary.mostActiveDay = {
        date: mostActiveDay,
        actions: dailyActions[mostActiveDay],
      };
      summary.leastActiveDay = {
        date: leastActiveDay,
        actions: dailyActions[leastActiveDay],
      };
    }

    return summary;
  }

  async getContentPopularityTrend(
    contentId: string,
    days: number,
  ): Promise<any[]> {
    this.logger.log(
      `Fetching popularity trend for content ${contentId} over the last ${days} days`,
    );
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.userActionRepository
      .createQueryBuilder('action')
      .select('DATE(action.timestamp)', 'date')
      .addSelect('COUNT(*)', 'viewCount')
      .where('action.targetId = :contentId', { contentId })
      .andWhere('action.timestamp >= :startDate', { startDate })
      .groupBy('DATE(action.timestamp)')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  async getUserSegmentation(): Promise<any> {
    this.logger.log('Performing user segmentation based on activity levels');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userActions = await this.userActionRepository
      .createQueryBuilder('action')
      .select('action.userId', 'userId')
      .addSelect('COUNT(*)', 'actionCount')
      .where('action.timestamp >= :thirtyDaysAgo', { thirtyDaysAgo })
      .groupBy('action.userId')
      .getRawMany();

    const totalUsers = userActions.length;
    const totalActions = userActions.reduce(
      (sum, user) => sum + Number.parseInt(user.actionCount),
      0,
    );
    const averageActions = totalActions / totalUsers;

    const segments = {
      highlyActive: 0,
      moderatelyActive: 0,
      lowlyActive: 0,
    };

    userActions.forEach((user) => {
      if (Number.parseInt(user.actionCount) > averageActions * 1.5) {
        segments.highlyActive++;
      } else if (Number.parseInt(user.actionCount) >= averageActions * 0.5) {
        segments.moderatelyActive++;
      } else {
        segments.lowlyActive++;
      }
    });

    return {
      totalUsers,
      averageActions,
      segments,
      segmentPercentages: {
        highlyActive: (segments.highlyActive / totalUsers) * 100,
        moderatelyActive: (segments.moderatelyActive / totalUsers) * 100,
        lowlyActive: (segments.lowlyActive / totalUsers) * 100,
      },
    };
  }

  async getSessionDurationDistribution(): Promise<any> {
    this.logger.log('Calculating session duration distribution');
    const sessions = await this.userActionRepository
      .createQueryBuilder('action')
      .select('action.userId', 'userId')
      .addSelect('action.timestamp', 'timestamp')
      .orderBy('action.userId', 'ASC')
      .addOrderBy('action.timestamp', 'ASC')
      .getRawMany();

    const sessionDurations = [];
    let currentUserId = null;
    let sessionStart = null;

    sessions.forEach((action) => {
      if (action.userId !== currentUserId) {
        currentUserId = action.userId;
        sessionStart = new Date(action.timestamp);
      } else {
        const duration =
          (new Date(action.timestamp).getTime() - sessionStart.getTime()) /
          60000; // in minutes
        if (duration <= 30) {
          // Assume session ends after 30 minutes of inactivity
          sessionDurations.push(duration);
        }
        sessionStart = new Date(action.timestamp);
      }
    });

    const distribution = {
      '0-5 min': 0,
      '5-15 min': 0,
      '15-30 min': 0,
      '30+ min': 0,
    };

    sessionDurations.forEach((duration) => {
      if (duration <= 5) distribution['0-5 min']++;
      else if (duration <= 15) distribution['5-15 min']++;
      else if (duration <= 30) distribution['15-30 min']++;
      else distribution['30+ min']++;
    });

    return distribution;
  }
}
