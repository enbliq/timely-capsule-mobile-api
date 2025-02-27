import { IsOptional, IsString, IsNumber } from "class-validator"

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  avatarUrl?: string

  @IsNumber()
  userId: number // User making the update (for permission check)
}

