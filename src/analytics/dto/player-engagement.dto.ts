import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDate, IsArray } from 'class-validator';

export class PlayerEngagementDto {
  @ApiProperty({
    description: 'Total number of sessions',
    example: 120,
  })
  @IsNumber()
  totalSessions: number;

  @ApiProperty({
    description: 'Total number of sessions',
    example: 120,
  })
  @IsNumber()
  activeUsers: number;

  @ApiProperty({
    description: 'Average session duration in minutes',
    example: 30.5,
  })
  @IsNumber()
  averageSessionDuration: number;

  @ApiProperty({ description: 'Retention rate as a percentage', example: 75.2 })
  @IsNumber()
  retentionRate: number;

  @ApiProperty({
    description: 'Hours with peak activity',
    type: [Number],
    example: [12, 18, 21],
  })
  @IsArray()
  peakActivityHours: number[];

  @ApiProperty({
    description: 'Timestamp of the engagement data',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  timestamp: Date;
}
