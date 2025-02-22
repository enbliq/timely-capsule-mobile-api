import { IsUUID, IsNumber, IsNotEmpty, IsEnum } from 'class-validator';

enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
}

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string; // User involved in the transaction

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType: TransactionType; // 'deposit' or 'withdrawal'
}
