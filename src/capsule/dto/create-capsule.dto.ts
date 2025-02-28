import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsInt,
} from 'class-validator';

export class CreateCapsuleDto {
  @ApiPropertyOptional({
    description: 'Title of the capsule',
    type: String,
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Content of the capsule',
    type: String,
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Media associated with the capsule',
    type: String,
  })
  @IsOptional()
  @IsString()
  media?: string;

  @ApiProperty({
    description: 'Password for accessing the capsule',
    type: String,
    maxLength: 16,
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    description: 'Email of the recipient',
    type: String,
  })
  @IsEmail()
  recipientEmail: string;

  @ApiPropertyOptional({
    description: 'Recipient link',
    type: String,
  })
  @IsOptional()
  @IsString()
  recipientLink?: string;

  // @IsDate()
  // unlockAt: Date;

  // @IsDate()
  // expiresAt: Date;

  @ApiPropertyOptional({
    description: 'fundId',
    type: String,
  })
  @IsOptional()
  @IsString()
  fundId?: string;

  @ApiPropertyOptional({
    description: 'isClaimed',
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  isClaimed?: boolean;

  @ApiPropertyOptional({
    description: 'isGuest',
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  isGuest?: boolean;

  @ApiProperty({ description: 'createdBy', type: String })
  @IsUUID()
  createdBy: string;
}