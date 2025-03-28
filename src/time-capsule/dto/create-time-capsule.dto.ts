import { IsNotEmpty, IsString, IsDate, IsNumber } from "class-validator"
//CreateTimeCapsulteDto
export class CreateTimeCapsuleDto {
  @IsNotEmpty()
  @IsString()
  content: string

  @IsNotEmpty()
  @IsDate()
  openDate: Date

  @IsNotEmpty()
  @IsNumber()
  userId: number
}

