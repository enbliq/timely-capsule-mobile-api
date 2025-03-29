import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards } from "@nestjs/common"
import type { ReportsService } from "./reports.service"
import type { CreateReportDto } from "./dto/create-report.dto"
import type { UpdateReportDto } from "./dto/update-report.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../users/entities/user.entity"
import { GetUser } from "../auth/decorators/get-user.decorator"
import type { User } from "../users/entities/user.entity"
import type { ReportQueryDto } from "./dto/report-query.dto"
import { ReportStatus } from "./entities/report.entity"

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createReportDto: CreateReportDto, @GetUser() user: User) {
    return this.reportsService.create(createReportDto, user)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(@Query() query: ReportQueryDto) {
    return this.reportsService.findAll(query.status);
  }

  @Get("pending")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findPending() {
    return this.reportsService.findAll(ReportStatus.PENDING)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(id, updateReportDto)
  }
}

