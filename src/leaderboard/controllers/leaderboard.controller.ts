import { Controller, Get, Query, Param } from "@nestjs/common"
import type { LeaderboardService } from "../services/leaderboard.service"
import type { LeaderboardFilterDto } from "../dtos/leaderboard-filter.dto"
import type { LeaderboardResponseDto } from "../dtos/leaderboard-response.dto"

@Controller("analytics/leaderboard")
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard(
    @Query() filterDto: LeaderboardFilterDto,
  ): Promise<LeaderboardResponseDto> {
    return this.leaderboardService.getLeaderboard(filterDto);
  }

  @Get('user/:userId')
  async getUserStats(@Param('userId') userId: string) {
    return this.leaderboardService.getUserStats(userId);
  }

  @Get("user/:userId/rank")
  async getUserRank(
    @Param('userId') userId: string,
    @Query() filterDto: LeaderboardFilterDto,
  ): Promise<{ rank: number }> {
    const rank = await this.leaderboardService.getUserRank(userId, filterDto.timeRange)
    return { rank }
  }
}

