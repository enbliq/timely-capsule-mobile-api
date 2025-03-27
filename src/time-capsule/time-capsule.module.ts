import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TimeCapsuleService } from "./time-capsule.service"
import { TimeCapsuleController } from "./time-capsule.controller"
import { TimeCapsule } from "./entities/time-capsule.entity"
import { UsersModule } from "../users/users.module"
import { StreaksModule } from "../streaks/streaks.module"

@Module({
  imports: [TypeOrmModule.forFeature([TimeCapsule]), UsersModule, StreaksModule],
  controllers: [TimeCapsuleController],
  providers: [TimeCapsuleService],
})
export class TimeCapsuleModule {}

