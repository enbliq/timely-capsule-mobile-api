import { IsString, IsUrl, IsArray, IsOptional, IsBoolean } from "class-validator"

export class CreateSubscriptionDto {
  @IsString()
  name: string

  @IsUrl()
  url: string

  @IsArray()
  events: string[]

  @IsString()
  secret: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsBoolean()
  active?: boolean
}

