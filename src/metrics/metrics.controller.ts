import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { GetMetricsDto } from './dto/get-metrics.dto';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post()
  create(@Body() createMetricDto: CreateMetricDto) {
    return this.metricsService.create(createMetricDto);
  }

  @Get('active-users')
  getActiveUsers(@Query() getMetricsDto: GetMetricsDto) {
    return this.metricsService.getActiveUsers(getMetricsDto);
  }

  @Get('churn-rate')
  getChurnRate(@Query() getMetricsDto: GetMetricsDto) {
    return this.metricsService.getChurnRate(getMetricsDto);
  }

  @Get('cohort-analysis')
  getCohortAnalysis(@Query() getMetricsDto: GetMetricsDto) {
    return this.metricsService.getCohortAnalysis(getMetricsDto);
  }
}