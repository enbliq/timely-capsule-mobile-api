import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { type Model, isValidObjectId } from "mongoose"
import { Capsule, type CapsuleDocument } from "../models/capsule.schema"
import type { CreateCapsuleDto } from "./dto/create-capsule.dto"
import type { UpdateCapsuleDto } from "./dto/update-capsule.dto"
import { v4 as uuidv4 } from "uuid"
import type { EncryptionService } from "../encryption/encryption.service"

@Injectable()
export class CapsulesService {
  constructor(
    @InjectModel(Capsule.name)
    private capsuleModel: Model<CapsuleDocument>,
    private encryptionService: EncryptionService,
  ) {}

  async create(createCapsuleDto: CreateCapsuleDto): Promise<Capsule> {
    // Generate a uniqueique capsule link
    const capsuleLink = uuidv4()

    // Handle encryption metadata if password protected
    if (createCapsuleDto.isPasswordProtected) {
      // Ensure encryption metadata is provided
      if (!createCapsuleDto.encryption) {
        throw new BadRequestException("Encryption metadata is required for password-protected capsules")
      }

      // Validate encryption metadata
      if (!this.encryptionService.validateEncryptionMetadata(createCapsuleDto.encryption)) {
        throw new BadRequestException("Invalid encryption metadata")
      }

      // Ensure content is encrypted
      if (createCapsuleDto.content && createCapsuleDto.content.length > 0) {
        for (const contentItem of createCapsuleDto.content) {
          if (!this.encryptionService.isLikelyEncrypted(contentItem)) {
            throw new BadRequestException("Content must be encrypted for password-protected capsules")
          }
        }
      }
    }

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

    // Handle encryption metadata updates
    if (updateCapsuleDto.isPasswordProtected !== undefined) {
      // If changing from non-password-protected to password-protected
      if (updateCapsuleDto.isPasswordProtected && !capsule.isPasswordProtected) {
        // Ensure encryption metadata is provided
        if (!updateCapsuleDto.encryption) {
          throw new BadRequestException("Encryption metadata is required when enabling password protection")
        }

        // Validate encryption metadata
        if (!this.encryptionService.validateEncryptionMetadata(updateCapsuleDto.encryption)) {
          throw new BadRequestException("Invalid encryption metadata")
        }

        // Ensure content is encrypted or will be updated with encrypted content
        if (updateCapsuleDto.content) {
          for (const contentItem of updateCapsuleDto.content) {
            if (!this.encryptionService.isLikelyEncrypted(contentItem)) {
              throw new BadRequestException("Content must be encrypted for password-protected capsules")
            }
          }
        } else if (capsule.content && capsule.content.length > 0) {
          throw new BadRequestException("Existing content must be encrypted when enabling password protection")
        }
      }

      // If changing from password-protected to non-password-protected
      if (!updateCapsuleDto.isPasswordProtected && capsule.isPasswordProtected) {
        throw new BadRequestException("Cannot remove password protection from a capsule")
      }
    }

    // If the capsule is password protected, don't allow direct content updates unless they're encrypted
    if (capsule.isPasswordProtected && updateCapsuleDto.content) {
      for (const contentItem of updateCapsuleDto.content) {
        if (!this.encryptionService.isLikelyEncrypted(contentItem)) {
          throw new BadRequestException("Content must be encrypted for password-protected capsules")
        }
      }
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
    if (capsule.isPasswordProtected && !this.encryptionService.isLikelyEncrypted(content)) {
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
