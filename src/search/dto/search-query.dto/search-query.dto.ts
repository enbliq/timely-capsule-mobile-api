import { IsOptional, IsString, IsNumber, IsArray, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiProperty({
    type: 'string',
    example: 'nestjs',
    description: 'Search query string',
    required: false,
  })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['nestjs', 'swagger'],
    description: 'Array of tags to filter search results',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2024-01-01T00:00:00Z',
    description: 'Start date for filtering results',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2024-02-01T00:00:00Z',
    description: 'End date for filtering results',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    type: 'string',
    example: 'john_doe',
    description: 'Username of the contributor',
    required: false,
  })
  @IsString()
  @IsOptional()
  contributedBy?: string;

  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'Page number, must be at least 1',
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    type: 'number',
    example: 20,
    description: 'Number of results per page (max 100)',
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @ApiProperty({
    type: 'string',
    enum: ['popularity', 'date', 'relevance'],
    example: 'relevance',
    description: 'Sorting criterion',
    required: false,
  })
  @IsString()
  @IsOptional()
  sortBy?: 'popularity' | 'date' | 'relevance' = 'relevance';

  @ApiProperty({
    type: 'string',
    enum: ['asc', 'desc'],
    example: 'desc',
    description: 'Sorting order',
    required: false,
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

