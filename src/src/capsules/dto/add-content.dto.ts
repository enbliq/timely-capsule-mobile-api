import { IsNotEmpty, IsString } from "class-validator"

export class AddContentDto {
  @IsString()
  @IsNotEmpty()
  content: string
}
