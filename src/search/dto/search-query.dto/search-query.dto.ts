import { IsOptional, IsString, IsNumber, IsArray, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchQueryDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  contributedBy?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @IsString()
  @IsOptional()
  sortBy?: 'popularity' | 'date' | 'relevance' = 'relevance';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

