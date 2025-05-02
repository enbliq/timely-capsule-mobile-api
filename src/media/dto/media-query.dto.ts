import { IsEnum, IsMongoId, IsOptional, IsBoolean } from "class-validator"
import type { MediaType } from "../../models/media.schema"

export class MediaQueryDto {
  @IsEnum(["image", "video", "audio"])
  @IsOptional()
  type?: MediaType

  @IsMongoId()
  @IsOptional()
  capsuleId?: string

  @IsBoolean()
  @IsOptional()
  encrypted?: boolean
}
