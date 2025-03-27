import { IsOptional, IsString, IsNumber, IsArray, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
// import { ApiProperty } from '@nestjs/swagger';

export class SearchResultDto {
  // @ApiProperty({ required: false, description: 'Search query string' })
  @IsString()
  @IsOptional()
  query?: string;

  // @ApiProperty({ required: false, description: 'Array of tags to filter by', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  // @ApiProperty({ required: false, description: 'Start date for date range filtering (ISO format)' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  // @ApiProperty({ required: false, description: 'End date for date range filtering (ISO format)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  // @ApiProperty({ required: false, description: 'Filter by user ID who contributed the content' })
  @IsString()
  @IsOptional()
  contributedBy?: string;

  // @ApiProperty({ required: false, description: 'Page number for pagination', default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  // @ApiProperty({ required: false, description: 'Number of items per page', default: 20 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  // @ApiProperty({ 
  //   required: false, 
  //   description: 'Field to sort by', 
  //   enum: ['popularity', 'date', 'relevance'],
  //   default: 'relevance'
  // })
  @IsString()
  @IsOptional()
  sortBy?: 'popularity' | 'date' | 'relevance' = 'relevance';

  // @ApiProperty({ 
  //   required: false, 
  //   description: 'Sort order', 
  //   enum: ['asc', 'desc'],
  //   default: 'desc'
  // })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
