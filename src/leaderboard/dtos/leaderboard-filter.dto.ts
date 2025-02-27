import { IsEnum, IsOptional, IsInt, Min, Max } from "class-validator"
import { Type } from "class-transformer"

export enum TimeRange {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  ALL_TIME = "all-time",
}

export class LeaderboardFilterDto {
  @IsEnum(TimeRange)
  @IsOptional()
  timeRange: TimeRange = TimeRange.ALL_TIME

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page = 1

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit = 10
}

