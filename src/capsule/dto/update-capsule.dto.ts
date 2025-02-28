import { PartialType } from '@nestjs/mapped-types';
import { CreateCapsuleDto } from './create-capsule.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCapsuleDto extends PartialType(CreateCapsuleDto) {
  @ApiPropertyOptional({ 
    description: 'Title of the capsule', type: String 
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ 
    description: 'Content of the capsule', type: String 
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ 
    description: 'Media associated with the capsule', type: String 
  })
  @IsOptional()
  @IsString()
  media?: string;

  @ApiPropertyOptional({ 
    description: 'Password for accessing the capsule', type: String 
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    description: 'Email of the recipient',
    type: String,
  })
  @IsOptional()
  @IsString()
  recipientEmail?: string;

  @ApiPropertyOptional({
    description: 'Recipient link',
    type: String,
  })
  @IsOptional()
  @IsString()
  recipientLink?: string;

  @ApiPropertyOptional({
    description: 'Fund ID associated with the capsule',
    type: String,
  })
  @IsOptional()
  @IsString()
  fundId?: string;

  @ApiPropertyOptional({
    description: 'Indicates if the capsule is claimed',
    type: Boolean,
  })
  @IsOptional()
  @IsString()
  isClaimed?: boolean;

  @ApiPropertyOptional({
    description: 'Indicates if the user is a guest',
    type: Boolean,
  })
  @IsOptional()
  @IsString()
  isGuest?: boolean;

  // @IsNotEmpty()
  // @IsInt()
  // createdBy: number;
}
