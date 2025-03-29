import { IsEnum, IsOptional } from "class-validator"
import { ReportStatus } from "../entities/report.entity"

export class ReportQueryDto {
  @IsEnum(ReportStatus)
  @IsOptional()
  status?: ReportStatus
}

