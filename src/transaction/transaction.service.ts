import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserService } from 'src/user/user.service';
import { CapsuleService } from 'src/capsule/capsule.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    private readonly userService: UserService,
    private readonly capsuleService: CapsuleService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  public async findAll(limit: number, page: number): Promise<Transaction[]> {
    const skip = (page - 1) * limit;

    return this.transactionRepository.find({
      skip,
      take: limit,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
