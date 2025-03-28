import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { LeaderboardController } from "./controllers/leaderboard.controller"
import { ContributionService } from "./services/contribution.service"
import { LeaderboardService } from "./services/leaderboard.service"
import { Contribution } from "./entities/contribution.entity"
import { User } from "./entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Contribution, User])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService, ContributionService],
  exports: [LeaderboardService, ContributionService],
})
export class AnalyticsModule {}

