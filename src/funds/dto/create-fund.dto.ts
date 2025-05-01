import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import type { ObjectId } from 'mongoose';

export class CreateFundDto {
  @IsMongoId()
  capsuleId: ObjectId;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  amount: number;

  @IsMongoId()
  senderId: ObjectId;

  @IsString()
  @IsOptional()
  claimConditions?: string;
}
