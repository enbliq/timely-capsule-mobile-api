import { Expose } from "class-transformer"
import { PublicCapsule } from "../publicCapsule.entity"

export class PublicCapsuleResponseDto {
  @Expose()
  id: string

  @Expose()
  title: string

  @Expose()
  description: string

  @Expose()
  content: Record<string, any>

  @Expose()
  creatorId: string

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date

  constructor(partial: Partial<PublicCapsule>) {
    Object.assign(this, partial)
  }
}

