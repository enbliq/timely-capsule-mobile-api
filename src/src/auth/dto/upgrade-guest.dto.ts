import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class UpgradeGuestDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsString()
  @IsNotEmpty()
  displayName: string
}
