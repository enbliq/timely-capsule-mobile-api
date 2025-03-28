import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common"
import type { StreaksService } from "./streaks.service"
import type { Streak } from "./entities/streak.entity"

@Controller("streaks")
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @Get('user/:userId')
  async getUserStreak(@Param('userId', ParseIntPipe) userId: number): Promise<Streak> {
    return this.streaksService.getStreakByUserId(userId);
  }
}

