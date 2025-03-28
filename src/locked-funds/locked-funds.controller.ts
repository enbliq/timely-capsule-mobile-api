import { Controller, Post, Body, Param, UseGuards, Request } from "@nestjs/common"
import type { LockedFundsService } from "./locked-funds.service"
import type { LockFundsDto } from "./dto/lock-funds.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@Controller("funds")
export class LockedFundsController {
  constructor(private readonly lockedFundsService: LockedFundsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('lock')
  async lockFunds(@Body() lockFundsDto: LockFundsDto) {
    return this.lockedFundsService.lockFunds(lockFundsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("cancel/:lockId")
  async cancelLock(@Param('lockId') lockId: string, @Request() req) {
    return this.lockedFundsService.cancelLock(lockId, req.user.id)
  }
}

