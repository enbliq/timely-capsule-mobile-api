import { PartialType } from "@nestjs/mapped-types"
import { CreatePublicCapsuleDto } from "./create-public-capsule.dto"

export class UpdatePublicCapsuleDto extends PartialType(CreatePublicCapsuleDto) {}

