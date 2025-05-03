import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator"
import type { MediaType } from "../../models/media.schema"
import type { ObjectId } from "mongoose"

export class CreateMediaDto {
  @IsEnum(["image", "video", "audio"])
  type: MediaType

  @IsString()
  @IsNotEmpty()
  storageUrl: string

  @IsBoolean()
  @IsOptional()
  encrypted?: boolean

  @IsString()
  @IsOptional()
  iv?: string

  @IsMongoId()
  @IsOptional()
  capsuleId?: ObjectId
}
