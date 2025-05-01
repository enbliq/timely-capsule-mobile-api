import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common"
import type { FundsService } from "./funds.service"
import type { CreateFundDto } from "./dto/create-fund.dto"
import type { UpdateFundDto } from "./dto/update-fund.dto"

@Controller("funds")
export class FundsController {
  constructor(private readonly fundsService: FundsService) {}

  @Post()
  create(@Body() createFundDto: CreateFundDto) {
    return this.fundsService.create(createFundDto)
  }

  @Get()
  findAll() {
    return this.fundsService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.fundsService.findOne(id)
  }

  @Get("capsule/:capsuleId")
  findByCapsule(@Param("capsuleId") capsuleId: string) {
    return this.fundsService.findByCapsule(capsuleId)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateFundDto: UpdateFundDto) {
    return this.fundsService.update(id, updateFundDto)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.fundsService.remove(id)
  }
}
