import { Controller, Get, Post, Body, Param, ParseIntPipe } from "@nestjs/common"
import type { TimeCapsuleService } from "./time-capsule.service"
import type { CreateTimeCapsuleDto } from "./dto/create-time-capsule.dto"
import type { TimeCapsule } from "./entities/time-capsule.entity"

@Controller("time-capsules")
export class TimeCapsuleController {
  constructor(private readonly timeCapsuleService: TimeCapsuleService) {}

  @Post()
  async create(@Body() createTimeCapsuleDto: CreateTimeCapsuleDto): Promise<TimeCapsule> {
    return this.timeCapsuleService.create(createTimeCapsuleDto);
  }

  @Get()
  async findAll(): Promise<TimeCapsule[]> {
    return this.timeCapsuleService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TimeCapsule> {
    return this.timeCapsuleService.findOne(id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<TimeCapsule[]> {
    return this.timeCapsuleService.findByUser(userId);
  }
}

