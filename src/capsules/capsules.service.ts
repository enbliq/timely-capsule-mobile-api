import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { Capsule, type CapsuleDocument } from "../models/capsule.schema"
import type { CreateCapsuleDto } from "./dto/create-capsule.dto"
import type { UpdateCapsuleDto } from "./dto/update-capsule.dto"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class CapsulesService {
  constructor(
    @InjectModel(Capsule.name) private capsuleModel: Model<CapsuleDocument>,
  ) {}

  async create(createCapsuleDto: CreateCapsuleDto): Promise<Capsule> {
    const capsuleLink = uuidv4()
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
    return this.capsuleModel.find({ ownerId }).exec()
  }

  async findByCollaborator(userId: string): Promise<Capsule[]> {
    return this.capsuleModel.find({ collaborators: userId }).exec()
  }

  async update(id: string, updateCapsuleDto: UpdateCapsuleDto): Promise<Capsule> {
    const updatedCapsule = await this.capsuleModel.findByIdAndUpdate(id, updateCapsuleDto, { new: true }).exec()
    if (!updatedCapsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }
    return updatedCapsule
  }

  async remove(id: string): Promise<Capsule> {
    const deletedCapsule = await this.capsuleModel.findByIdAndDelete(id).exec()
    if (!deletedCapsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }
    return deletedCapsule
  }

  async addCollaborator(id: string, collaboratorId: string): Promise<Capsule> {
    const capsule = await this.capsuleModel.findById(id).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }

    if (!capsule.collaborators.includes(collaboratorId)) {
      capsule.collaborators.push(collaboratorId)
      return capsule.save()
    }

    return capsule
  }

  async removeCollaborator(id: string, collaboratorId: string): Promise<Capsule> {
    const capsule = await this.capsuleModel.findById(id).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }

    capsule.collaborators = capsule.collaborators.filter((collab) => collab.toString() !== collaboratorId)
    return capsule.save()
  }

  async addMedia(id: string, mediaId: string): Promise<Capsule> {
    const capsule = await this.capsuleModel.findById(id).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }

    if (!capsule.media.includes(mediaId)) {
      capsule.media.push(mediaId)
      return capsule.save()
    }

    return capsule
  }

  async removeMedia(id: string, mediaId: string): Promise<Capsule> {
    const capsule = await this.capsuleModel.findById(id).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }

    capsule.media = capsule.media.filter((media) => media.toString() !== mediaId)
    return capsule.save()
  }

  async addContent(id: string, content: string): Promise<Capsule> {
    const capsule = await this.capsuleModel.findById(id).exec()
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`)
    }

    capsule.content.push(content)
    return capsule.save()
  }
}
