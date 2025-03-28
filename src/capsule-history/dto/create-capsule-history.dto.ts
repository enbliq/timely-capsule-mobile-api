import { IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { CapsuleActionType } from '../entities/capsule-history.entity';

export class CreateCapsuleHistoryDto {
  @IsEnum(CapsuleActionType)
  actionType: CapsuleActionType;

  @IsUUID()
  capsuleId: string;

  @IsObject()
  @IsOptional()
  changes?: Record<string, any>;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsUUID()
  @IsOptional()
  previousOwnerId?: string;

  @IsUUID()
  @IsOptional()
  newOwnerId?: string;
}
