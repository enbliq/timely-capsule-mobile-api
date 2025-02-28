import { IsString, IsUrl, IsArray, IsOptional, IsBoolean } from "class-validator"

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsUrl()
  url?: string

  @IsOptional()
  @IsArray()
  events?: string[]

  @IsOptional()
  @IsString()
  secret?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsBoolean()
  active?: boolean
}

