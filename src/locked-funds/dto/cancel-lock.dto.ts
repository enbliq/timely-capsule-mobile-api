import { IsNotEmpty, IsUUID } from "class-validator"

export class CancelLockDto {
  @IsUUID()
  @IsNotEmpty()
  lockId: string
}

