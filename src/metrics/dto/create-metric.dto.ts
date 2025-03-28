import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateMetricDto {
  @ApiProperty({
    type: 'string',
    example: 'user_login',
    description: 'Type of event being recorded',
  })
  @IsString()
  eventType: string;

  @ApiProperty({
    type: 'number',
    example: 12345,
    description: 'ID of the user associated with the event',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    type: 'object',
    description: 'Optional metadata associated with the event',
    example: { location: 'New York', device: 'Mobile' },
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}