import { IsEnum, IsOptional } from "class-validator"
import { ReportStatus } from "../entities/report.entity"

export class UpdateReportDto {
  @IsEnum(ReportStatus)
  @IsOptional()
  status?: ReportStatus
}

