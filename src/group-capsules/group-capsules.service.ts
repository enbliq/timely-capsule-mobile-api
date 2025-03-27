import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { GroupCapsule } from "./entities/group-capsule.entity"
import type { CreateGroupCapsuleDto } from "./dto/create-group-capsule.dto"
import type { UpdateGroupCapsuleDto } from "./dto/update-group-capsule.dto"
import type { UsersService } from "../users/users.service"

@Injectable()
export class GroupCapsulesService {
  constructor(
    @InjectRepository(GroupCapsule)
    private groupCapsulesRepository: Repository<GroupCapsule>,
    private usersService: UsersService,
  ) {}

  async create(createGroupCapsuleDto: CreateGroupCapsuleDto, userId: string): Promise<GroupCapsule> {
    const { contributorIds, viewerIds, ...capsuleData } = createGroupCapsuleDto

    // Create new capsule
    const newCapsule = this.groupCapsulesRepository.create({
      ...capsuleData,
      ownerId: userId,
      openDate: createGroupCapsuleDto.openDate ? new Date(createGroupCapsuleDto.openDate) : null,
    })

    // Add contributors
    const contributors = await Promise.all(contributorIds.map((id) => this.usersService.findOne(id)))
    newCapsule.contributors = contributors.filter(Boolean)

    // Add viewers if provided
    if (viewerIds && viewerIds.length > 0) {
      const viewers = await Promise.all(viewerIds.map((id) => this.usersService.findOne(id)))
      newCapsule.viewers = viewers.filter(Boolean)
    } else {
      newCapsule.viewers = []
    }

    return this.groupCapsulesRepository.save(newCapsule)
  }

  async findAll(userId: string): Promise<GroupCapsule[]> {
    return this.groupCapsulesRepository
      .createQueryBuilder("capsule")
      .leftJoinAndSelect("capsule.contributors", "contributors")
      .leftJoinAndSelect("capsule.viewers", "viewers")
      .where("capsule.ownerId = :userId", { userId })
      .orWhere("contributors.id = :userId", { userId })
      .orWhere("viewers.id = :userId", { userId })
      .getMany()
  }

  async findOne(id: string): Promise<GroupCapsule> {
    const capsule = await this.groupCapsulesRepository.findOne({
      where: { id },
      relations: ["contributors", "viewers"],
    })

    if (!capsule) {
      throw new NotFoundException(`Group capsule with ID ${id} not found`)
    }

    return capsule
  }

  async update(id: string, updateGroupCapsuleDto: UpdateGroupCapsuleDto, userId: string): Promise<GroupCapsule> {
    const capsule = await this.findOne(id)

    // Only owner can update the capsule
    if (capsule.ownerId !== userId) {
      throw new ForbiddenException("Only the owner can update the capsule")
    }

    const { contributorIds, viewerIds, ...updateData } = updateGroupCapsuleDto

    // Update basic capsule data
    Object.assign(capsule, {
      ...updateData,
      openDate: updateGroupCapsuleDto.openDate ? new Date(updateGroupCapsuleDto.openDate) : capsule.openDate,
    })

    // Update contributors if provided
    if (contributorIds && contributorIds.length > 0) {
      const contributors = await Promise.all(contributorIds.map((id) => this.usersService.findOne(id)))
      capsule.contributors = contributors.filter(Boolean)
    }

    // Update viewers if provided
    if (viewerIds && viewerIds.length > 0) {
      const viewers = await Promise.all(viewerIds.map((id) => this.usersService.findOne(id)))
      capsule.viewers = viewers.filter(Boolean)
    }

    return this.groupCapsulesRepository.save(capsule)
  }

  async remove(id: string, userId: string): Promise<void> {
    const capsule = await this.findOne(id)

    // Only owner can delete the capsule
    if (capsule.ownerId !== userId) {
      throw new ForbiddenException("Only the owner can delete the capsule")
    }

    await this.groupCapsulesRepository.remove(capsule)
  }

  async addContributor(id: string, contributorId: string, userId: string): Promise<GroupCapsule> {
    const capsule = await this.findOne(id)

    // Only owner can add contributors
    if (capsule.ownerId !== userId) {
      throw new ForbiddenException("Only the owner can add contributors")
    }

    const contributor = await this.usersService.findOne(contributorId)

    if (!contributor) {
      throw new NotFoundException(`User with ID ${contributorId} not found`)
    }

    // Check if user is already a contributor
    const isAlreadyContributor = capsule.contributors.some((c) => c.id === contributorId)

    if (!isAlreadyContributor) {
      capsule.contributors.push(contributor)
      return this.groupCapsulesRepository.save(capsule)
    }

    return capsule
  }

  async removeContributor(id: string, contributorId: string, userId: string): Promise<GroupCapsule> {
    const capsule = await this.findOne(id)

    // Only owner can remove contributors
    if (capsule.ownerId !== userId) {
      throw new ForbiddenException("Only the owner can remove contributors")
    }

    capsule.contributors = capsule.contributors.filter((contributor) => contributor.id !== contributorId)

    return this.groupCapsulesRepository.save(capsule)
  }

  async addViewer(id: string, viewerId: string, userId: string): Promise<GroupCapsule> {
    const capsule = await this.findOne(id)

    // Only owner can add viewers
    if (capsule.ownerId !== userId) {
      throw new ForbiddenException("Only the owner can add viewers")
    }

    const viewer = await this.usersService.findOne(viewerId)

    if (!viewer) {
      throw new NotFoundException(`User with ID ${viewerId} not found`)
    }

    // Check if user is already a viewer
    const isAlreadyViewer = capsule.viewers.some((v) => v.id === viewerId)

    if (!isAlreadyViewer) {
      capsule.viewers.push(viewer)
      return this.groupCapsulesRepository.save(capsule)
    }

    return capsule
  }

  async removeViewer(id: string, viewerId: string, userId: string): Promise<GroupCapsule> {
    const capsule = await this.findOne(id)

    // Only owner can remove viewers
    if (capsule.ownerId !== userId) {
      throw new ForbiddenException("Only the owner can remove viewers")
    }

    capsule.viewers = capsule.viewers.filter((viewer) => viewer.id !== viewerId)

    return this.groupCapsulesRepository.save(capsule)
  }
}

