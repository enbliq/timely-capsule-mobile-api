import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator"

export class CreateReportDto {
  @IsUUID()
  @IsNotEmpty()
  capsuleId: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string
}

