import { 
    IsUUID, 
    IsNumber, 
    IsString, 
    IsOptional, 
    IsPositive 
  } from 'class-validator';
  
  export class CreateTransactionDto {
    @IsNumber()
    @IsPositive()
    amount: number;
  
    @IsString()
    currency: string;
  
    @IsString()
    status: string;
  
    @IsOptional()
    @IsString()
    transactionHash?: string;
  
    @IsString()
    type: string;
  
    @IsUUID()
    userId: string;
  
    @IsOptional()
    @IsUUID()
    capsuleId?: string;
  }
  