import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GroupCapsulesService } from "./group-capsules.service"
import { GroupCapsulesController } from "./group-capsules.controller"
import { GroupCapsule } from "./entities/group-capsule.entity"
import { UsersModule } from "../users/users.module"

@Module({
  imports: [TypeOrmModule.forFeature([GroupCapsule]), UsersModule],
  controllers: [GroupCapsulesController],
  providers: [GroupCapsulesService],
  exports: [GroupCapsulesService],
})
export class GroupCapsulesModule {}

