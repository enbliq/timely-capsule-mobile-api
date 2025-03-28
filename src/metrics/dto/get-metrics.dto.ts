import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsEnum } from 'class-validator';

export enum MetricPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export class GetMetricsDto {
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2024-01-01T00:00:00Z',
    description: 'Start date for the metric data',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2024-02-01T00:00:00Z',
    description: 'End date for the metric data',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    type: 'string',
    enum: ['daily', 'weekly', 'monthly'],
    example: 'daily',
    description: 'The period for which metrics are aggregated',
    required: false,
  })
  @IsEnum(MetricPeriod)
  @IsOptional()
  period?: MetricPeriod = MetricPeriod.DAILY;
}