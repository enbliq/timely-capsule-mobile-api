import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { LockedFundsService } from "./locked-funds.service"
import { LockedFundsController } from "./locked-funds.controller"
import { LockedFunds } from "./entities/locked-funds.entity"
import { UsersModule } from "../users/users.module"
import { ScheduleModule } from "@nestjs/schedule"
import { LockedFundsScheduler } from "./locked-funds.scheduler"

@Module({
  imports: [TypeOrmModule.forFeature([LockedFunds]), UsersModule, ScheduleModule.forRoot()],
  controllers: [LockedFundsController],
  providers: [LockedFundsService, LockedFundsScheduler],
  exports: [LockedFundsService],
})
export class LockedFundsModule {}

