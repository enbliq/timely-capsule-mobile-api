import { PartialType } from '@nestjs/mapped-types';
import { CreateCapsuleDto } from './create-capsule.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCapsuleDto extends PartialType(CreateCapsuleDto) {

    @IsOptional()
      @IsString()
      title?: string;

      
    @IsOptional()
    @IsString()
    content?: string;


    @IsOptional()
      @IsString()
      media?: string;
      
    @IsOptional()
    @IsString()
    password?: string;

    
    @IsOptional()
      @IsString()
      recipientEmail?: string;

      
    @IsOptional()
    @IsString()
    recipientLink?: string;

    
    @IsOptional()
      @IsString()
      fundId?: string;

    
      @IsOptional()
      @IsString()
      isClaimed?: boolean;
      
    @IsOptional()
    @IsString()
    isGuest?: boolean;

    
      // @IsNotEmpty()
      // @IsInt()
      // createdBy: number;


}
