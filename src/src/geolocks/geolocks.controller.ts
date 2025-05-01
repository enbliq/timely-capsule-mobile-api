import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common"
import type { GeolocksService } from "./geolocks.service"
import type { CreateGeolockDto } from "./dto/create-geolock.dto"
import type { UpdateGeolockDto } from "./dto/update-geolock.dto"

@Controller("geolocks")
export class GeolocksController {
  constructor(private readonly geolocksService: GeolocksService) {}

  @Post()
  create(@Body() createGeolockDto: CreateGeolockDto) {
    return this.geolocksService.create(createGeolockDto)
  }

  @Get()
  findAll() {
    return this.geolocksService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.geolocksService.findOne(id);
  }

  @Get("capsule/:capsuleId")
  findByCapsule(@Param("capsuleId") capsuleId: string) {
    return this.geolocksService.findByCapsule(capsuleId);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGeolockDto: UpdateGeolockDto) {
    return this.geolocksService.update(id, updateGeolockDto)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.geolocksService.remove(id);
  }
}
