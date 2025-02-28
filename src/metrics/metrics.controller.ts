import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { GetMetricsDto } from './dto/get-metrics.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @ApiOperation({ summary: 'Create a new metric' })
  @ApiResponse({ status: 201, description: 'Metric created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @Post()
  create(@Body() createMetricDto: CreateMetricDto) {
    return this.metricsService.create(createMetricDto);
  }

  @ApiOperation({ summary: 'Get active users based on filters' })
  @ApiResponse({ status: 200, description: 'Active users retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiQuery({ name: 'startDate', type: 'string', required: false, description: 'Start date for filtering (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', type: 'string', required: false, description: 'End date for filtering (YYYY-MM-DD)' })
  @Get('active-users')
  getActiveUsers(@Query() getMetricsDto: GetMetricsDto) {
    return this.metricsService.getActiveUsers(getMetricsDto);
  }

  @ApiOperation({ summary: 'Get churn rate over a period' })
  @ApiResponse({ status: 200, description: 'Churn rate retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiQuery({ name: 'startDate', type: 'string', required: false, description: 'Start date for filtering (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', type: 'string', required: false, description: 'End date for filtering (YYYY-MM-DD)' })
  @Get('churn-rate')
  getChurnRate(@Query() getMetricsDto: GetMetricsDto) {
    return this.metricsService.getChurnRate(getMetricsDto);
  }

  @ApiOperation({ summary: 'Get cohort analysis based on user behavior' })
  @ApiResponse({ status: 200, description: 'Cohort analysis retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiQuery({ name: 'startDate', type: 'string', required: false, description: 'Start date for filtering (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', type: 'string', required: false, description: 'End date for filtering (YYYY-MM-DD)' })
  @Get('cohort-analysis')
  getCohortAnalysis(@Query() getMetricsDto: GetMetricsDto) {
    return this.metricsService.getCohortAnalysis(getMetricsDto);
  }
}