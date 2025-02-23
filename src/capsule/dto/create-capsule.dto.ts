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
  
    @IsDate()
    unlockAt: Date;
  
    @IsDate()
    expiresAt: Date;
  
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
  