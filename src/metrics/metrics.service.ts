import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Metric } from './entities/metric.entity';
import { CreateMetricDto } from './dto/create-metric.dto';
import { GetMetricsDto, MetricPeriod } from './dto/get-metrics.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Metric)
    private readonly metricRepository: Repository<Metric>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createMetricDto: CreateMetricDto) {
    const metric = this.metricRepository.create(createMetricDto);
    return await this.metricRepository.save(metric);
  }

  async getActiveUsers(dto: GetMetricsDto) {
    const { startDate, endDate = new Date(), period } = dto;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const query = this.metricRepository
      .createQueryBuilder('metric')
      .select('COUNT(DISTINCT metric.userId)', 'activeUsers')
      .where('metric.timestamp BETWEEN :start AND :end', {
        start,
        end,
      });

    if (period === MetricPeriod.DAILY) {
      query.addSelect('DATE(metric.timestamp)', 'date')
        .groupBy('DATE(metric.timestamp)');
    } else if (period === MetricPeriod.WEEKLY) {
      query.addSelect('DATE_TRUNC(\'week\', metric.timestamp)', 'date')
        .groupBy('DATE_TRUNC(\'week\', metric.timestamp)');
    } else if (period === MetricPeriod.MONTHLY) {
      query.addSelect('DATE_TRUNC(\'month\', metric.timestamp)', 'date')
        .groupBy('DATE_TRUNC(\'month\', metric.timestamp)');
    }

    return await query.getRawMany();
  }

  async getChurnRate(dto: GetMetricsDto) {
    const { startDate, endDate = new Date() } = dto;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const activeUsers = await this.metricRepository
      .createQueryBuilder('metric')
      .select('COUNT(DISTINCT metric.userId)', 'count')
      .where('metric.timestamp BETWEEN :start AND :end', {
        start,
        end,
      })
      .getRawOne();

    const totalUsers = await this.userRepository.count();
    const churnRate = (totalUsers - activeUsers.count) / totalUsers;

    return {
      totalUsers,
      activeUsers: activeUsers.count,
      churnRate,
      period: { start, end },
    };
  }

  async getCohortAnalysis(dto: GetMetricsDto) {
    const { startDate, endDate = new Date() } = dto;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get users grouped by their registration month
    const cohorts = await this.userRepository
      .createQueryBuilder('user')
      .select('DATE_TRUNC(\'month\', user.createdAt)', 'cohort')
      .addSelect('COUNT(user.id)', 'totalUsers')
      .where('user.createdAt BETWEEN :start AND :end', {
        start,
        end,
      })
      .groupBy('DATE_TRUNC(\'month\', user.createdAt)')
      .getRawMany();

    // For each cohort, calculate retention in subsequent months
    const retentionData = await Promise.all(
      cohorts.map(async (cohort) => {
        const retention = await this.metricRepository
          .createQueryBuilder('metric')
          .select('DATE_TRUNC(\'month\', metric.timestamp)', 'month')
          .addSelect('COUNT(DISTINCT metric.userId)', 'activeUsers')
          .where('metric.timestamp >= :cohortDate', {
            cohortDate: cohort.cohort,
          })
          .groupBy('DATE_TRUNC(\'month\', metric.timestamp)')
          .getRawMany();

        return {
          cohort: cohort.cohort,
          totalUsers: cohort.totalUsers,
          retention,
        };
      }),
    );

    return retentionData;
  }
}