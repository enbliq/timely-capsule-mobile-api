import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  // Accept a plain password that will later be hashed
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsBoolean()
  isGuest?: boolean;

  @IsOptional()
  @IsString()
  subscriptionTier?: string;

  @IsOptional()
  @IsString()
  walletAddress?: string;
}