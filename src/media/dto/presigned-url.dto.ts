import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import type { MediaType } from "../../models/media.schema"

export class PresignedUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName: string

  @IsString()
  @IsNotEmpty()
  fileType: string

  @IsEnum(["image", "video", "audio"])
  mediaType: MediaType

  @IsBoolean()
  @IsOptional()
  encrypted?: boolean

  @IsString()
  @IsOptional()
  iv?: string
}
