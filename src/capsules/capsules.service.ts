import { NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common"
import { isValidObjectId } from "mongoose"
import type { Capsule } from "../models/capsule.schema"
import type { UpdateCapsuleDto } from "./dto/update-capsule.dto"
import { v4 as uuidv4 } from "uuid"

export class CapsulesService {
  constructor(private capsuleModel: any) {}

  async create(createCapsuleDto: any): Promise<Capsule> {
    // Generate a unique capsule link
    const capsuleLink = uuidv4()

    // Create the capsule
    const createdCapsule = new this.capsuleModel({
      ...createCapsuleDto,
      capsuleLink,
    })

    return createdCapsule.save()
  }

  async findAll(): Promise<Capsule[]> {
    return this.capsuleModel.find().exec()
  }

  async findOne(id: string): Promise<Capsule> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`)
    }

    const capsule = await this.capsuleModel.findById(id).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }
    return capsule
  }

  async findByLink(capsuleLink: string): Promise<Capsule> {
    const capsule = await this.capsuleModel.findOne({ capsuleLink }).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with link ${capsuleLink} not found`)
    }
    return capsule
  }

  async findByOwner(ownerId: string): Promise<Capsule[]> {
    if (!isValidObjectId(ownerId)) {
      throw new BadRequestException(`Invalid owner ID format: ${ownerId}`)
    }
    return this.capsuleModel.find({ ownerId }).exec()
  }

  async findByCollaborator(userId: string): Promise<Capsule[]> {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException(`Invalid user ID format: ${userId}`)
    }
    return this.capsuleModel.find({ collaborators: userId }).exec()
  }

  async update(id: string, updateCapsuleDto: UpdateCapsuleDto): Promise<Capsule> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`)
    }

    // Check if the capsule exists
    const capsule = await this.capsuleModel.findById(id).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }

    // If the capsule is password protected, don't allow direct content updates
    if (capsule.isPasswordProtected && updateCapsuleDto.content) {
      throw new ForbiddenException("Cannot directly update content of password-protected capsules")
    }

    const updatedCapsule = await this.capsuleModel.findByIdAndUpdate(id, updateCapsuleDto, { new: true }).exec()

    return updatedCapsule
  }

  async remove(id: string): Promise<Capsule> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`)
    }

    const deletedCapsule = await this.capsuleModel.findByIdAndDelete(id).exec()
    if (!deletedCapsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }
    return deletedCapsule
  }

  async addCollaborator(id: string, collaboratorId: string): Promise<Capsule> {
    if (!isValidObjectId(id) || !isValidObjectId(collaboratorId)) {
      throw new BadRequestException(`Invalid ID format`)
    }

    const capsule = await this.capsuleModel.findById(id).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }

    if (!capsule.collaborators) {
      capsule.collaborators = []
    }

    if (!capsule.collaborators.includes(collaboratorId)) {
      capsule.collaborators.push(collaboratorId)
      return capsule.save()
    }

    return capsule
  }

  async removeCollaborator(id: string, collaboratorId: string): Promise<Capsule> {
    if (!isValidObjectId(id) || !isValidObjectId(collaboratorId)) {
      throw new BadRequestException(`Invalid ID format`)
    }

    const capsule = await this.capsuleModel.findById(id).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }

    if (!capsule.collaborators) {
      return capsule
    }

    capsule.collaborators = capsule.collaborators.filter((collab) => collab.toString() !== collaboratorId)
    return capsule.save()
  }

  async addMedia(id: string, mediaId: string): Promise<Capsule> {
    if (!isValidObjectId(id) || !isValidObjectId(mediaId)) {
      throw new BadRequestException(`Invalid ID format`)
    }

    const capsule = await this.capsuleModel.findById(id).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }

    if (!capsule.media) {
      capsule.media = []
    }

    if (!capsule.media.includes(mediaId)) {
      capsule.media.push(mediaId)
      return capsule.save()
    }

    return capsule
  }

  async removeMedia(id: string, mediaId: string): Promise<Capsule> {
    if (!isValidObjectId(id) || !isValidObjectId(mediaId)) {
      throw new BadRequestException(`Invalid ID format`)
    }

    const capsule = await this.capsuleModel.findById(id).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }

    if (!capsule.media) {
      return capsule
    }

    capsule.media = capsule.media.filter((media) => media.toString() !== mediaId)
    return capsule.save()
  }

  async addContent(id: string, content: string): Promise<Capsule> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`)
    }

    const capsule = await this.capsuleModel.findById(id).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }

    // If the capsule is password protected, ensure content is encrypted
    if (capsule.isPasswordProtected && !content.startsWith("encrypted:")) {
      throw new BadRequestException("Content must be encrypted for password-protected capsules")
    }

    if (!capsule.content) {
      capsule.content = []
    }

    capsule.content.push(content)
    return capsule.save()
  }

  async isUnlockable(id: string): Promise<{ unlockable: boolean; reason?: string }> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`)
    }

    const capsule = await this.capsuleModel.findById(id).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }

    // Check if the capsule is time-locked
    const now = new Date()
    if (capsule.openAt > now) {
      return {
        unlockable: false,
        reason: `Capsule is time-locked until ${capsule.openAt.toISOString()}`,
      }
    }

    // If we reach here, the capsule is unlockable
    return { unlockable: true }
  }
}
