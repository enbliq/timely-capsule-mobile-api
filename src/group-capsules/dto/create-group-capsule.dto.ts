import { IsNotEmpty, IsString, IsOptional, IsDateString, IsArray, IsUUID } from "class-validator"

export class CreateGroupCapsuleDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsOptional()
  @IsDateString()
  openDate?: string

  @IsArray()
  @IsUUID("4", { each: true })
  contributorIds: string[]

  @IsArray()
  @IsUUID("4", { each: true })
  @IsOptional()
  viewerIds?: string[]
}

