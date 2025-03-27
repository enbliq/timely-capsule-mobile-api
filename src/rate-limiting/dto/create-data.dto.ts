import { IsNotEmpty, IsString, IsOptional } from "class-validator"

export class CreateDataDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  content: string

  @IsOptional()
  @IsString()
  category?: string
}

