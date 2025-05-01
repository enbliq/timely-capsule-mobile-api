import { PartialType } from "@nestjs/mapped-types"
import { CreateCapsuleDto } from "./create-capsule.dto"
import { IsArray, IsMongoId, IsOptional, IsString } from "class-validator"
import type { ObjectId } from "mongoose"

export class UpdateCapsuleDto extends PartialType(CreateCapsuleDto) {
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  collaborators?: ObjectId[]

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  media?: ObjectId[]

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  content?: string[]
}
