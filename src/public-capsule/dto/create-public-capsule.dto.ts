import { IsNotEmpty, IsString, IsObject, MaxLength } from "class-validator"

export class CreatePublicCapsuleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string

  @IsNotEmpty()
  @IsObject()
  content: Record<string, any>
}

