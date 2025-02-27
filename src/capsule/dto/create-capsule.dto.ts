
import { 
    IsString, 
    IsEmail, 
    IsOptional, 
    IsBoolean, 
    IsUUID, 
    IsDate 
  } from 'class-validator';
  
  export class CreateCapsuleDto {
    @IsString()
    title: string;
  
    @IsString()
    content: string;
  
    @IsOptional()
    @IsString()
    media?: string;
  
    @IsString()
    password: string;
  
    @IsEmail()
    recipientEmail: string;
  
    @IsOptional()
    @IsString()
    recipientLink?: string;
  
    // @IsDate()
    // unlockAt: Date;
  
    // @IsDate()
    // expiresAt: Date;
  
    @IsOptional()
    @IsString()
    fundId?: string;
  
    @IsBoolean()
    @IsOptional()
    isClaimed?: boolean;
  
    @IsBoolean()
    @IsOptional()
    isGuest?: boolean;
  
    @IsUUID()
    createdBy: string;
  }

import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsInt
} from 'class-validator';

export class CreateCapsuleDto {
  @IsString()
  @IsOptional()  // Allow title to be optional
  title?: string;

  @IsString()
  @IsOptional()  // Allow content to be optional
  content?: string;

  @IsOptional()
  @IsString()
  media?: string;


  @IsString()
  @MaxLength(16)  // Adjust max length to match the regex
  @Matches(
    /^[a-zA-Z0-9]{8,16}$/,  // Accept only letters and numbers (8-16 chars)
    {
      message: 'Password must contain only letters and numbers, between 8 to 16 characters.',
    }
  )
  password?: string;

  @IsEmail()
  @IsOptional()  // Allow recipientEmail to be optional
  recipientEmail?: string;

  @IsOptional()
  @IsString()
  recipientLink?: string;

  @IsOptional()
  @IsString()
  fundId?: string;

  @IsOptional()
  @IsBoolean()
  isClaimed?: boolean;

  @IsOptional()
  @IsBoolean()
  isGuest?: boolean;

  @IsNotEmpty()
  @IsInt()
  createdBy?: number;  // Must be a valid UUID string
}

