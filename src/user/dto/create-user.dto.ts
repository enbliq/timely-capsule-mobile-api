import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsBoolean()
  @IsOptional()
  isGuest?: boolean;

  @IsOptional()
  @IsString()
  subscriptionTier?: string;

  @IsOptional()
  @IsString()
  walletAddress?: string;
}
