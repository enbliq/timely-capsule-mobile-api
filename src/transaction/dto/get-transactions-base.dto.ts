import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query-dto.dto';

class GetTransactionsBaseDto {
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class GetTransactionsDto extends IntersectionType(
  GetTransactionsBaseDto,
  PaginationQueryDto,
) {}
