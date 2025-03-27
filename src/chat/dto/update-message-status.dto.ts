import { IsNotEmpty, IsString, IsEnum } from "class-validator"
import { MessageStatus } from "../entities/message.entity"

export class UpdateMessageStatusDto {
  @IsNotEmpty()
  @IsString()
  messageId: string

  @IsNotEmpty()
  @IsEnum(MessageStatus)
  status: MessageStatus
}

