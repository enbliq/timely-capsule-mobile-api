import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { ChatGroup } from "../entities/chat-group.entity"
import { GroupMember, MemberRole } from "../entities/group-member.entity"
import type { CreateGroupDto } from "../dto/create-group.dto"
import type { UpdateGroupDto } from "../dto/update-group.dto"
import type { AddMemberDto } from "../dto/add-member.dto"

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(ChatGroup)
    private groupRepository: Repository<ChatGroup>,
    @InjectRepository(GroupMember)
    private memberRepository: Repository<GroupMember>,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto): Promise<ChatGroup> {
    const group = this.groupRepository.create({
      name: createGroupDto.name,
      description: createGroupDto.description,
      avatarUrl: createGroupDto.avatarUrl,
      creatorId: createGroupDto.creatorId,
    })

    const savedGroup = await this.groupRepository.save(group)

    // Add creator as admin
    const creatorMember = this.memberRepository.create({
      userId: createGroupDto.creatorId,
      groupId: savedGroup.id,
      role: MemberRole.ADMIN,
    })
    await this.memberRepository.save(creatorMember)

    // Add other members if provided
    if (createGroupDto.memberIds && createGroupDto.memberIds.length > 0) {
      const members = createGroupDto.memberIds.map((userId) => {
        return this.memberRepository.create({
          userId,
          groupId: savedGroup.id,
          role: MemberRole.MEMBER,
        })
      })
      await this.memberRepository.save(members)
    }

    return savedGroup
  }

  async getUserGroups(userId: number): Promise<ChatGroup[]> {
    const memberGroups = await this.memberRepository.find({
      where: { userId },
      relations: ["group"],
    })

    return memberGroups.map((member) => member.group)
  }

  async getGroupById(id: string): Promise<ChatGroup> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ["members"],
    })

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`)
    }

    return group
  }

  async updateGroup(id: string, updateGroupDto: UpdateGroupDto): Promise<ChatGroup> {
    const group = await this.getGroupById(id)

    // Check if user is admin
    const isAdmin = await this.isUserAdmin(id, updateGroupDto.userId)
    if (!isAdmin) {
      throw new ForbiddenException("Only group admins can update the group")
    }

    Object.assign(group, updateGroupDto)
    return this.groupRepository.save(group)
  }

  async deleteGroup(id: string): Promise<void> {
    const group = await this.getGroupById(id)
    await this.groupRepository.remove(group)
  }

  async addMember(groupId: string, addMemberDto: AddMemberDto): Promise<GroupMember> {
    const group = await this.getGroupById(groupId)

    // Check if user is already a member
    const existingMember = await this.memberRepository.findOne({
      where: {
        groupId,
        userId: addMemberDto.userId,
      },
    })

    if (existingMember) {
      throw new BadRequestException("User is already a member of this group")
    }

    const member = this.memberRepository.create({
      userId: addMemberDto.userId,
      groupId,
      role: addMemberDto.role || MemberRole.MEMBER,
    })

    return this.memberRepository.save(member)
  }

  async removeMember(groupId: string, userId: number): Promise<void> {
    const member = await this.memberRepository.findOne({
      where: {
        groupId,
        userId,
      },
    })

    if (!member) {
      throw new NotFoundException(`User with ID ${userId} is not a member of this group`)
    }

    await this.memberRepository.remove(member)
  }

  async updateMemberRole(groupId: string, userId: number, role: MemberRole): Promise<GroupMember> {
    const member = await this.memberRepository.findOne({
      where: {
        groupId,
        userId,
      },
    })

    if (!member) {
      throw new NotFoundException(`User with ID ${userId} is not a member of this group`)
    }

    member.role = role
    return this.memberRepository.save(member)
  }

  private async isUserAdmin(groupId: string, userId: number): Promise<boolean> {
    const member = await this.memberRepository.findOne({
      where: {
        groupId,
        userId,
      },
    })

    return member?.role === MemberRole.ADMIN
  }
}

