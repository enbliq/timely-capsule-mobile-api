import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { StreaksService } from "./streaks.service"
import { StreaksController } from "./streaks.controller"
import { Streak } from "./entities/streak.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Streak])],
  controllers: [StreaksController],
  providers: [StreaksService],
  exports: [StreaksService],
})
export class StreaksModule {}

