import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ReportsService } from "./reports.service"
import { ReportsController } from "./reports.controller"
import { Report } from "./entities/report.entity"
import { CapsuleModule } from "../capsules/capsules.module"

@Module({
  imports: [TypeOrmModule.forFeature([Report]), CapsuleModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}

