import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Report, ReportStatus } from "./entities/report.entity"
import type { CreateReportDto } from "./dto/create-report.dto"
import type { UpdateReportDto } from "./dto/update-report.dto"
import type { User } from "../users/entities/user.entity"
import type { CapsuleService } from "../capsules/capsules.service"

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    private capsuleService: CapsuleService,
  ) {}

  async create(createReportDto: CreateReportDto, user: User): Promise<Report> {
    // Check if capsule exists
    const capsule = await this.capsuleService.findOne(createReportDto.capsuleId)
    if (!capsule) {
      throw new NotFoundException("Capsule not found")
    }

    // Check if user has already reported this capsule
    const existingReport = await this.reportsRepository.findOne({
      where: {
        capsuleId: createReportDto.capsuleId,
        reportedById: user.id,
      },
    })

    if (existingReport) {
      throw new ForbiddenException("You have already reported this capsule")
    }

    const report = this.reportsRepository.create({
      ...createReportDto,
      reportedBy: user,
      reportedById: user.id,
      status: ReportStatus.PENDING,
    })

    return this.reportsRepository.save(report)
  }

  async findAll(status?: ReportStatus): Promise<Report[]> {
    const query = this.reportsRepository
      .createQueryBuilder("report")
      .leftJoinAndSelect("report.reportedBy", "user")
      .leftJoinAndSelect("report.capsule", "capsule")

    if (status) {
      query.where("report.status = :status", { status })
    }

    return query.orderBy("report.createdAt", "DESC").getMany()
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportsRepository.findOne({
      where: { id },
      relations: ["reportedBy", "capsule"],
    })

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`)
    }

    return report
  }

  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.findOne(id)

    Object.assign(report, updateReportDto)

    return this.reportsRepository.save(report)
  }
}

