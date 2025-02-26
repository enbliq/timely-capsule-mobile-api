import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateMetricDto {
  @IsString()
  eventType: string;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}