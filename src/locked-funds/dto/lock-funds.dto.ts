import { IsDate, IsDecimal, IsNotEmpty, IsString, IsUUID, MinDate } from "class-validator"
import { Type } from "class-transformer"

export class LockFundsDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string

  @IsDecimal({ decimal_digits: "0,2" })
  @IsNotEmpty()
  amount: number

  @IsString()
  @IsNotEmpty()
  currency: string

  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  lockUntil: Date
}

