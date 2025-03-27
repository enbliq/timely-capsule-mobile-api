import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { CreatePublicCapsuleDto } from "src/public-capsule/dto/create-public-capsule.dto"
import { PublicCapsuleResponseDto } from "src/public-capsule/dto/public-capsule-response.dto"
import { PublicCapsule } from "src/public-capsule/publicCapsule.entity"
import type { Repository } from "typeorm"

@Injectable()
export class PublicCapsulesService {
  constructor(
    @InjectRepository(PublicCapsule)
    private publicCapsuleRepository: Repository<PublicCapsule>,
  ) {}

  async create(createPublicCapsuleDto: CreatePublicCapsuleDto, userId: string): Promise<PublicCapsuleResponseDto> {
    const publicCapsule = this.publicCapsuleRepository.create({
      ...createPublicCapsuleDto,
      creatorId: userId,
    })

    const savedCapsule = await this.publicCapsuleRepository.save(publicCapsule)
    return new PublicCapsuleResponseDto(savedCapsule)
  }

  async findAll(page = 1, limit = 10): Promise<{ items: PublicCapsuleResponseDto[]; total: number }> {
    const [items, total] = await this.publicCapsuleRepository.findAndCount({
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    })

    return {
      items: items.map((item) => new PublicCapsuleResponseDto(item)),
      total,
    }
  }

  async findOne(id: string): Promise<PublicCapsuleResponseDto> {
    const publicCapsule = await this.publicCapsuleRepository.findOne({ where: { id } })

    if (!publicCapsule) {
      throw new NotFoundException(`Public capsule with ID ${id} not found`)
    }

    return new PublicCapsuleResponseDto(publicCapsule)
  }

  async remove(id: string, userId: string): Promise<void> {
    const publicCapsule = await this.publicCapsuleRepository.findOne({ where: { id } })

    if (!publicCapsule) {
      throw new NotFoundException(`Public capsule with ID ${id} not found`)
    }

    if (publicCapsule.creatorId !== userId) {
      throw new ForbiddenException("You can only delete your own public capsules")
    }

    await this.publicCapsuleRepository.remove(publicCapsule)
  }
}