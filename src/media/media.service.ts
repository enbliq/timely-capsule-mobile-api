import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { type Model, isValidObjectId } from "mongoose"
import { Media, type MediaDocument } from "../models/media.schema"
import type { CreateMediaDto } from "./dto/create-media.dto"
import type { UpdateMediaDto } from "./dto/update-media.dto"
import type { PresignedUrlDto } from "./dto/presigned-url.dto"
import type { PresignedUrlResponseDto } from "./dto/presigned-url-response.dto"
import type { StorageService } from "../storage/storage.service"
import type { EncryptionService } from "../encryption/encryption.service"

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
    private storageService: StorageService,
    private encryptionService: EncryptionService,
  ) {}

  async getPresignedUploadUrl(presignedUrlDto: PresignedUrlDto): Promise<PresignedUrlResponseDto> {
    const { fileName, fileType, encrypted = false, iv } = presignedUrlDto

    // If encrypted, validate IV
    if (encrypted && !iv) {
      throw new BadRequestException("IV is required for encrypted media")
    }

    if (encrypted && iv) {
      // Validate IV format
      try {
        const ivBuffer = Buffer.from(iv, "base64")
        if (ivBuffer.length !== 12) {
          throw new BadRequestException("Invalid IV format: must be 12 bytes encoded as base64")
        }
      } catch (error) {
        throw new BadRequestException("Invalid IV format: must be base64 encoded")
      }
    }

    // Get presigned URL from storage service
    const presignedData = await this.storageService.getPresignedUrl(fileName, fileType, encrypted)

    return presignedData
  }

  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    // If media is encrypted, ensure IV is provided
    if (createMediaDto.encrypted && !createMediaDto.iv) {
      throw new BadRequestException("IV is required for encrypted media")
    }

    // If media is encrypted, ensure storage URL has the encrypted/ prefix
    if (createMediaDto.encrypted && !createMediaDto.storageUrl.includes("encrypted/")) {
      throw new BadRequestException("Encrypted media must be stored in the encrypted/ directory")
    }

    const createdMedia = new this.mediaModel({
      ...createMediaDto,
      uploadedAt: new Date(),
    })
    return createdMedia.save()
  }

  async findAll(): Promise<Media[]> {
    return this.mediaModel.find().exec()
  }

  async findOne(id: string): Promise<Media> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`)
    }

    const media = await this.mediaModel.findById(id).exec()
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`)
    }
    return media
  }

  async update(id: string, updateMediaDto: UpdateMediaDto): Promise<Media> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`)
    }

    const updatedMedia = await this.mediaModel.findByIdAndUpdate(id, updateMediaDto, { new: true }).exec()
    if (!updatedMedia) {
      throw new NotFoundException(`Media with ID ${id} not found`)
    }
    return updatedMedia
  }

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`)
    }

    const media = await this.mediaModel.findById(id).exec()
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`)
    }

    // Delete the media document
    await this.mediaModel.findByIdAndDelete(id).exec()
  }
}
