import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import type { LockedFundsService } from "./locked-funds.service"

@Injectable()
export class LockedFundsScheduler {
  private readonly logger = new Logger(LockedFundsScheduler.name)

  constructor(private readonly lockedFundsService: LockedFundsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAutomaticUnlocking() {
    this.logger.debug("Checking for expired locks...")

    try {
      const expiredLocks = await this.lockedFundsService.findExpiredLocks()

      for (const lock of expiredLocks) {
        this.logger.debug(`Releasing lock: ${lock.id}`)
        await this.lockedFundsService.releaseFunds(lock.id)
      }

      if (expiredLocks.length > 0) {
        this.logger.debug(`Released ${expiredLocks.length} expired locks`)
      }
    } catch (error) {
      this.logger.error("Error in automatic unlocking job", error)
    }
  }
}

