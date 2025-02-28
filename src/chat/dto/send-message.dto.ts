import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsEnum } from "class-validator"
import { Type } from "class-transformer"
import { AttachmentType } from "../entities/attachment.entity"

class AttachmentDto {
  @IsNotEmpty()
  @IsString()
  url: string

  @IsNotEmpty()
  @IsString()
  filename: string

  @IsNotEmpty()
  @IsEnum(AttachmentType)
  type: string

  @IsNotEmpty()
  @IsNumber()
  size: number
}

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string

  @IsNotEmpty()
  @IsNumber()
  senderId: number

  @IsOptional()
  @IsNumber()
  receiverId?: number

  @IsOptional()
  @IsString()
  groupId?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[]
}

