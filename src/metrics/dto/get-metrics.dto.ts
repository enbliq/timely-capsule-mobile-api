import { IsDateString, IsOptional, IsEnum } from 'class-validator';

export enum MetricPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export class GetMetricsDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(MetricPeriod)
  @IsOptional()
  period?: MetricPeriod = MetricPeriod.DAILY;
}