import { Controller, Get, Post, Body, Param, Delete, Put, Query } from "@nestjs/common"
import type { GroupService } from "../services/group.service"
import type { CreateGroupDto } from "../dto/create-group.dto"
import type { UpdateGroupDto } from "../dto/update-group.dto"
import type { AddMemberDto } from "../dto/add-member.dto"
import type { UpdateMemberRoleDto } from "../dto/update-member-role.dto"

@Controller("chat/groups")
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createGroup(createGroupDto);
  }

  @Get()
  async getAllGroups(@Query('userId') userId: number) {
    return this.groupService.getUserGroups(userId);
  }

  @Get(':id')
  async getGroupById(@Param('id') id: string) {
    return this.groupService.getGroupById(id);
  }

  @Put(":id")
  async updateGroup(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.updateGroup(id, updateGroupDto)
  }

  @Delete(':id')
  async deleteGroup(@Param('id') id: string) {
    return this.groupService.deleteGroup(id);
  }

  @Post(":id/members")
  async addMember(@Param('id') groupId: string, @Body() addMemberDto: AddMemberDto) {
    return this.groupService.addMember(groupId, addMemberDto)
  }

  @Delete(":id/members/:userId")
  async removeMember(@Param('id') groupId: string, @Param('userId') userId: number) {
    return this.groupService.removeMember(groupId, userId)
  }

  @Put(":id/members/:userId/role")
  async updateMemberRole(
    @Param('id') groupId: string,
    @Param('userId') userId: number,
    @Body() updateRoleDto: UpdateMemberRoleDto,
  ) {
    return this.groupService.updateMemberRole(groupId, userId, updateRoleDto.role)
  }
}

