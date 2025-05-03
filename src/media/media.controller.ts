import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from "@nestjs/common"
import type { MediaService } from "./media.service"
import type { CreateMediaDto } from "./dto/create-media.dto"
import type { UpdateMediaDto } from "./dto/update-media.dto"
import type { PresignedUrlDto } from "./dto/presigned-url.dto"
import type { MediaQueryDto } from "./dto/media-query.dto"

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get("presign")
  getPresignedUploadUrl(@Query() presignedUrlDto: PresignedUrlDto) {
    return this.mediaService.getPresignedUploadUrl(presignedUrlDto)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto)
  }

  @Get()
  findAll(@Query() query: MediaQueryDto) {
    return this.mediaService.findAll(query)
  }

  @Get("capsule/:capsuleId")
  findByCapsuleId(@Param("capsuleId") capsuleId: string) {
    return this.mediaService.findByCapsuleId(capsuleId)
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.mediaService.findOne(id)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(id, updateMediaDto)
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    await this.mediaService.remove(id)
  }
}
