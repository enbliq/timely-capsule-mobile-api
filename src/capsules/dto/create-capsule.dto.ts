import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ObjectId } from 'mongoose';
import type { CapsuleType } from '../../models/capsule.schema';

export class EncryptionDto {
  @IsEnum(['AES-256-GCM'])
  algorithm: 'AES-256-GCM';

  @IsBoolean()
  encrypted: boolean;

  @IsString()
  iv: string;
}

export class CreateCapsuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  content: string[];

  @IsDate()
  @Type(() => Date)
  openAt: Date;

  @IsMongoId()
  ownerId: ObjectId;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean()
  @IsOptional()
  isPasswordProtected?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsEnum(['standard', 'secretDrop', 'lab', 'admin'])
  capsuleType: CapsuleType;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  collaborators?: ObjectId[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  media?: ObjectId[];

  @IsMongoId()
  @IsOptional()
  funds?: ObjectId;

  @IsMongoId()
  @IsOptional()
  geolockId?: ObjectId;

  @IsObject()
  @IsOptional()
  encryption?: EncryptionDto;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
