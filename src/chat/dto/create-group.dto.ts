import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray } from "class-validator"

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  avatarUrl?: string

  @IsNotEmpty()
  @IsNumber()
  creatorId: number

  @IsOptional()
  @IsArray()
  memberIds?: number[]
}

