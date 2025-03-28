import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { LockedFunds, LockedFundStatus } from "./entities/locked-funds.entity"
import type { LockFundsDto } from "./dto/lock-funds.dto"
import type { UsersService } from "../users/users.service"

@Injectable()
export class LockedFundsService {
  constructor(
    @InjectRepository(LockedFunds)
    private lockedFundsRepository: Repository<LockedFunds>,
    private usersService: UsersService,
  ) {}

  async lockFunds(lockFundsDto: LockFundsDto): Promise<LockedFunds> {
    const { userId, amount, currency, lockUntil } = lockFundsDto

    // Validate future date
    if (lockUntil <= new Date()) {
      throw new BadRequestException("Lock until date must be in the future")
    }

    // Check if user exists and has sufficient balance
    const user = await this.usersService.findOne(userId)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    // Check if user has sufficient balance (assuming a balance field in user entity)
    if (user.balance < amount) {
      throw new BadRequestException("Insufficient balance")
    }

    // Deduct from user's balance
    await this.usersService.updateBalance(userId, -amount)

    // Create locked funds record
    const lockedFunds = this.lockedFundsRepository.create({
      userId,
      amount,
      currency,
      lockUntil,
      status: LockedFundStatus.LOCKED,
    })

    return this.lockedFundsRepository.save(lockedFunds)
  }

  async cancelLock(lockId: string, userId: string): Promise<LockedFunds> {
    const lockedFund = await this.lockedFundsRepository.findOne({
      where: { id: lockId, userId },
    })

    if (!lockedFund) {
      throw new NotFoundException("Locked fund not found")
    }

    if (lockedFund.status !== LockedFundStatus.LOCKED) {
      throw new BadRequestException("Cannot cancel a fund that is not in LOCKED state")
    }

    if (lockedFund.lockUntil <= new Date()) {
      throw new BadRequestException("Cannot cancel a lock that has already expired")
    }

    // Update status
    lockedFund.status = LockedFundStatus.CANCELLED
    await this.lockedFundsRepository.save(lockedFund)

    // Return funds to user
    await this.usersService.updateBalance(userId, lockedFund.amount)

    return lockedFund
  }

  async releaseFunds(lockId: string): Promise<LockedFunds> {
    const lockedFund = await this.lockedFundsRepository.findOne({
      where: { id: lockId },
    })

    if (!lockedFund) {
      throw new NotFoundException("Locked fund not found")
    }

    if (lockedFund.status !== LockedFundStatus.LOCKED) {
      throw new BadRequestException("Cannot release a fund that is not in LOCKED state")
    }

    // Update status
    lockedFund.status = LockedFundStatus.RELEASED
    await this.lockedFundsRepository.save(lockedFund)

    // Return funds to user
    await this.usersService.updateBalance(lockedFund.userId, lockedFund.amount)

    return lockedFund
  }

  async findExpiredLocks(): Promise<LockedFunds[]> {
    return this.lockedFundsRepository.find({
      where: {
        status: LockedFundStatus.LOCKED,
        lockUntil: { $lte: new Date() },
      },
    })
  }
}

