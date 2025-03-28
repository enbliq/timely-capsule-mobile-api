import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
  } from "@nestjs/common"
  import type { CreatePublicCapsuleDto } from "./dto/create-public-capsule.dto"
  import type { PublicCapsuleResponseDto } from "./dto/public-capsule-response.dto"
import { PublicCapsulesService } from "./providers/public-capsules.service.ts/public-capsules.service.ts.service";
import { AnalyticsRolesGuard } from "src/analytics/guards/analytics-roles.guard";
  
  @Controller("public-capsules")
  export class PublicCapsulesController {
    constructor(private readonly publicCapsulesService: PublicCapsulesService) {}
  
    @Post()
    @UseGuards(AnalyticsRolesGuard)
    async create(
      @Body() createPublicCapsuleDto: CreatePublicCapsuleDto,
      @Request() req,
    ): Promise<PublicCapsuleResponseDto> {
      return this.publicCapsulesService.create(createPublicCapsuleDto, req.user.id)
    }
  
    @Get()
    @UseGuards(AnalyticsRolesGuard)
    async findAll(
      @Query('page') page = 1,
      @Query('limit') limit = 10,
    ): Promise<{ items: PublicCapsuleResponseDto[]; total: number }> {
      return this.publicCapsulesService.findAll(+page, +limit)
    }
  
    @Get(':id')
    @UseGuards(AnalyticsRolesGuard)
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PublicCapsuleResponseDto> {
      return this.publicCapsulesService.findOne(id);
    }
  
    @Delete(":id")
    @UseGuards(AnalyticsRolesGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req): Promise<void> {
      return this.publicCapsulesService.remove(id, req.user.id)
    }
  }  