import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from "@nestjs/common"
import type { GroupCapsulesService } from "./group-capsules.service"
import type { CreateGroupCapsuleDto } from "./dto/create-group-capsule.dto"
import type { UpdateGroupCapsuleDto } from "./dto/update-group-capsule.dto"
import type { AddContributorDto } from "./dto/add-contributor.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { CapsuleAccessGuard } from "./guards/capsule-access.guard"
import { Role } from "./decorators/roles.decorator"

@Controller("group-capsules")
@UseGuards(JwtAuthGuard)
export class GroupCapsulesController {
  constructor(private readonly groupCapsulesService: GroupCapsulesService) {}

  @Post()
  create(@Body() createGroupCapsuleDto: CreateGroupCapsuleDto, @Request() req) {
    return this.groupCapsulesService.create(createGroupCapsuleDto, req.user.id)
  }

  @Get()
  findAll(@Request() req) {
    return this.groupCapsulesService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(CapsuleAccessGuard)
  @Role('viewer')
  findOne(@Param('id') id: string) {
    return this.groupCapsulesService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(CapsuleAccessGuard)
  @Role("contributor")
  update(@Param('id') id: string, @Body() updateGroupCapsuleDto: UpdateGroupCapsuleDto, @Request() req) {
    return this.groupCapsulesService.update(id, updateGroupCapsuleDto, req.user.id)
  }

  @Delete(":id")
  remove(@Param('id') id: string, @Request() req) {
    return this.groupCapsulesService.remove(id, req.user.id)
  }

  @Post(":id/contributors")
  addContributor(@Param('id') id: string, @Body() addContributorDto: AddContributorDto, @Request() req) {
    return this.groupCapsulesService.addContributor(id, addContributorDto.userId, req.user.id)
  }

  @Delete(":id/contributors/:contributorId")
  removeContributor(@Param('id') id: string, @Param('contributorId') contributorId: string, @Request() req) {
    return this.groupCapsulesService.removeContributor(id, contributorId, req.user.id)
  }

  @Post(":id/viewers")
  addViewer(@Param('id') id: string, @Body() addViewerDto: AddContributorDto, @Request() req) {
    return this.groupCapsulesService.addViewer(id, addViewerDto.userId, req.user.id)
  }

  @Delete(":id/viewers/:viewerId")
  removeViewer(@Param('id') id: string, @Param('viewerId') viewerId: string, @Request() req) {
    return this.groupCapsulesService.removeViewer(id, viewerId, req.user.id)
  }
}

