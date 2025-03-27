import { IsNotEmpty, IsEnum } from "class-validator"
import { MemberRole } from "../entities/group-member.entity"

export class UpdateMemberRoleDto {
  @IsNotEmpty()
  @IsEnum(MemberRole)
  role: MemberRole
}

