import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsBoolean, 
  IsUUID, 
  IsDateString, 
  IsNotEmpty 
} from 'class-validator';

export class CreateCapsuleDto {
  @IsString()
  @IsOptional()  // Ensure title is not empty
  title: string;

  @IsString()
  @IsOptional()  // Ensure content is not empty
  content: string;

  @IsOptional()
  @IsString()
  media?: string;

  @IsString()
  @IsNotEmpty()  // Ensure password is not empty
  password: string;

  @IsEmail()
  @IsOptional()  // Ensure recipientEmail is not empty
  recipientEmail: string;

  @IsOptional()
  @IsString()
  recipientLink?: string;

  @IsDateString()  // Validates as a date string
  unlockAt: string;

  @IsDateString()  // Validates as a date string
  expiresAt: string;

  @IsOptional()
  @IsString()
  fundId?: string;

  @IsOptional()  // Allow isClaimed to be optional
  @IsBoolean()
  isClaimed?: boolean;

  @IsOptional()  // Allow isGuest to be optional
  @IsBoolean()
  isGuest?: boolean;

  @IsUUID()  // Ensure this is a UUID and make it required
  createdBy: string; 
}