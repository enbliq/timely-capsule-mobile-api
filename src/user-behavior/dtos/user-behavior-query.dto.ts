import { IsOptional, IsInt, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
// import { ApiProperty } from '@nestjs/swagger';

export class UserBehaviorQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  // @ApiProperty({
  //   description: 'Number of results to return',
  //   default: 10,
  //   required: false,
  // })
  limit?: number = 10;

  @IsOptional()
  @IsDateString()
  // @ApiProperty({ description: 'Start date for the query', required: false })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  // @ApiProperty({ description: 'End date for the query', required: false })
  endDate?: string;
}
