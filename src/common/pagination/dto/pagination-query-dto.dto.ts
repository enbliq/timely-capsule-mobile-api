/* eslint-disable prettier/prettier */
import { IsOptional, IsPositive } from 'class-validator';

import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  // @Type(() => Number) //coverting strings to numbers
  @ApiProperty({
    type: 'number',
    example: 10,
    description: 'Number of results per page, must be a positive number',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  limit?: number = 10;

  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'Page number, must be a positive number',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  page?: number = 1;
}
