import { ApiProperty } from '@nestjs/swagger';
import { 
    IsUUID, 
    IsNumber, 
    IsString, 
    IsOptional, 
    IsPositive 
  } from 'class-validator';
  
  export class CreateTransactionDto {
    @ApiProperty({
      type: 'number',
      example: 100,
      description: 'Transaction amount, must be positive',
    })
    @IsNumber()
    @IsPositive()
    amount: number;
  
    @ApiProperty({
      type: 'string',
      example: 'USD',
      description: 'Currency of the transaction',
    })
    @IsString()
    currency: string;
  
    @ApiProperty({
      type: 'string',
      example: 'completed',
      description: 'Transaction status',
    })
    @IsString()
    status: string;
  
    @ApiProperty({
      type: 'string',
      example: '0xabc123...',
      description: 'Transaction hash if available',
      required: false,
    })
    @IsOptional()
    @IsString()
    transactionHash?: string;
  
    @ApiProperty({
      type: 'string',
      example: 'deposit',
      description: 'Type of transaction',
    })
    @IsString()
    type: string;
  
    @ApiProperty({
      type: 'string',
      example: '550e8400-e29b-41d4-a716-446655440000',
      description: 'User ID associated with the transaction',
    })
    @IsUUID()
    userId: string;
  
    @ApiProperty({
      type: 'string',
      example: '550e8400-e29b-41d4-a716-446655440001',
      description: 'Capsule ID if applicable',
      required: false,
    })
    @IsOptional()
    @IsUUID()
    capsuleId?: string;
  }
  