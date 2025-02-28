import { IsOptional, IsInt, Min, IsString, IsIn } from "class-validator"
import { Type } from "class-transformer"

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10

  @IsOptional()
  @IsString()
  sortBy?: string = "createdAt"

  @IsOptional()
  @IsString()
  @IsIn(["ASC", "DESC"])
  order?: "ASC" | "DESC" = "DESC"
}

