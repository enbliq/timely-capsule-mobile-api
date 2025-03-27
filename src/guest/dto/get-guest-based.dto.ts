import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query-dto.dto';

class GetGuestsBaseDto {
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class GetGuestsDto extends IntersectionType(
  GetGuestsBaseDto,
  PaginationQueryDto,
) {}
