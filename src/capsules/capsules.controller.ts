import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from "@nestjs/common"
import type { CapsulesService } from "./capsules.service"
import type { CreateCapsuleDto } from "./dto/create-capsule.dto"
import type { UpdateCapsuleDto } from "./dto/update-capsule.dto"
import type { AddContentDto } from "./dto/add-content.dto"

@Controller("capsules")
export class CapsulesController {
  constructor(private readonly capsulesService: CapsulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCapsuleDto: CreateCapsuleDto) {
    return this.capsulesService.create(createCapsuleDto);
  }

  @Get()
  findAll() {
    return this.capsulesService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.capsulesService.findOne(id);
  }

  @Get("link/:capsuleLink")
  findByLink(@Param("capsuleLink") capsuleLink: string) {
    return this.capsulesService.findByLink(capsuleLink);
  }

  @Get("owner/:ownerId")
  findByOwner(@Param("ownerId") ownerId: string) {
    return this.capsulesService.findByOwner(ownerId);
  }

  @Get("collaborator/:userId")
  findByCollaborator(@Param("userId") userId: string) {
    return this.capsulesService.findByCollaborator(userId);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCapsuleDto: UpdateCapsuleDto) {
    return this.capsulesService.update(id, updateCapsuleDto)
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    await this.capsulesService.remove(id);
  }

  @Post(":id/collaborators/:collaboratorId")
  addCollaborator(@Param("id") id: string, @Param("collaboratorId") collaboratorId: string) {
    return this.capsulesService.addCollaborator(id, collaboratorId)
  }

  @Delete(":id/collaborators/:collaboratorId")
  removeCollaborator(@Param("id") id: string, @Param("collaboratorId") collaboratorId: string) {
    return this.capsulesService.removeCollaborator(id, collaboratorId)
  }

  @Post(":id/media/:mediaId")
  addMedia(@Param("id") id: string, @Param("mediaId") mediaId: string) {
    return this.capsulesService.addMedia(id, mediaId)
  }

  @Delete(":id/media/:mediaId")
  removeMedia(@Param("id") id: string, @Param("mediaId") mediaId: string) {
    return this.capsulesService.removeMedia(id, mediaId)
  }

  @Post(":id/content")
  addContent(@Param("id") id: string, @Body() addContentDto: AddContentDto) {
    return this.capsulesService.addContent(id, addContentDto.content)
  }

  @Get(":id/unlockable")
  isUnlockable(@Param("id") id: string) {
    return this.capsulesService.isUnlockable(id);
  }
}
