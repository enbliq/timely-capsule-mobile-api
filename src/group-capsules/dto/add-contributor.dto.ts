import { IsNotEmpty, IsUUID } from "class-validator"

export class AddContributorDto {
  @IsNotEmpty()
  @IsUUID("4")
  userId: string
}

