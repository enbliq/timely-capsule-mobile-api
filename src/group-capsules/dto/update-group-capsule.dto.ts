import { IsOptional, IsString, IsDateString, IsArray, IsUUID, IsBoolean } from "class-validator"

export class UpdateGroupCapsuleDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsDateString()
  openDate?: string

  @IsOptional()
  @IsBoolean()
  isOpened?: boolean

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  contributorIds?: string[]

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  viewerIds?: string[]
}

