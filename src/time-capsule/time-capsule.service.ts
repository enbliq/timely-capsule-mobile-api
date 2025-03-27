import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { TimeCapsule } from "./entities/time-capsule.entity"
import type { CreateTimeCapsuleDto } from "./dto/create-time-capsule.dto"
import type { UsersService } from "../users/users.service"
import type { StreaksService } from "../streaks/streaks.service"

@Injectable()
export class TimeCapsuleService {
  constructor(
    @InjectRepository(TimeCapsule)
    private timeCapsuleRepository: Repository<TimeCapsule>,
    private usersService: UsersService,
    private streaksService: StreaksService,
  ) {}

  async create(createTimeCapsuleDto: CreateTimeCapsuleDto): Promise<TimeCapsule> {
    const user = await this.usersService.findOne(createTimeCapsuleDto.userId)

    const timeCapsule = this.timeCapsuleRepository.create({
      content: createTimeCapsuleDto.content,
      openDate: createTimeCapsuleDto.openDate,
      user,
    })

    // Update the user's streak
    await this.streaksService.updateStreakAfterCapsuleCreation(user)

    return this.timeCapsuleRepository.save(timeCapsule)
  }

  async findAll(): Promise<TimeCapsule[]> {
    return this.timeCapsuleRepository.find()
  }

  async findOne(id: number): Promise<TimeCapsule> {
    return this.timeCapsuleRepository.findOne({ where: { id } })
  }

  async findByUser(userId: number): Promise<TimeCapsule[]> {
    return this.timeCapsuleRepository.find({
      where: { user: { id: userId } },
      relations: ["user"],
    })
  }
}

