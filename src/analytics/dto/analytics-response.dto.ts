import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsObject, IsOptional } from 'class-validator';

export class AnalyticsResponseDto {
  @ApiProperty({
    description: 'Timestamp of the analytics data',
    type: Date,
  })
  @IsDate()
  timestamp: Date;

  @ApiProperty({
    description: 'Analytics data payload',
    type: Object,
  })
  @IsObject()
  data: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Optional metadata for additional context',
    type: Object,
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
