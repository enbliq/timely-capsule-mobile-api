import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsObject } from 'class-validator';

export class AggregatedAnalyticsDto {
  @ApiProperty({
    description: 'Timestamp of the analytics data',
    type: Date,
  })
  @IsDate()
  timestamp: Date;

  @ApiProperty({
    description: 'Player engagement data',
    type: Object,
  })
  @IsObject()
  playerEngagement: Record<string, any>;

  @ApiProperty({
    description: 'Song categories data',
    type: Object,
  })
  @IsObject()
  songCategories: Record<string, any>;

  @ApiProperty({
    description: 'Token economy data',
    type: Object,
  })
  @IsObject()
  tokenEconomy: Record<string, any>;

  @ApiProperty({
    description: 'User progression data',
    type: Object,
  })
  @IsObject()
  userProgression: Record<string, any>;

  @ApiProperty({
    description: 'Summary containing aggregated analytics values',
    type: Object,
  })
  @IsObject()
  summary: {
    totalActiveUsers: number;
    topCategory: string;
    tokenCirculation: number;
    averageUserLevel: number;
    timestamp: Date;
  };
}