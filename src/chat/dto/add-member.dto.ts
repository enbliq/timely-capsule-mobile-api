import { IsNotEmpty, IsNumber, IsOptional, IsEnum } from "class-validator"
import { MemberRole } from "../entities/group-member.entity"

export class AddMemberDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number

  @IsOptional()
  @IsEnum(MemberRole)
  role?: MemberRole
}

