import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query-dto.dto';
import { IntersectionType } from '@nestjs/mapped-types';

class GetUsersBaseDto {
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class GetUsersDto extends IntersectionType(
  GetUsersBaseDto,
  PaginationQueryDto,
) {}
