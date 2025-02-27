import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Contribution } from "../entities/contribution.entity"
import { User } from "../entities/user.entity"
import { ContributionType } from "../enums/contribution-type.enum"

@Injectable()
export class ContributionService {
  constructor(
    @InjectRepository(Contribution)
    private contributionRepository: Repository<Contribution>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createContribution(userId: string, type: ContributionType, resourceId: string): Promise<Contribution> {
    // Points allocation based on contribution type
    const pointsMap = {
      [ContributionType.SUBMISSION]: 10,
      [ContributionType.EDIT]: 5,
      [ContributionType.APPROVAL]: 3,
    }

    const points = pointsMap[type]

    // Create the contribution
    const contribution = this.contributionRepository.create({
      userId,
      type,
      resourceId,
      points,
    })

    // Save the contribution
    await this.contributionRepository.save(contribution)

    // Update user's total points
    await this.userRepository.increment({ id: userId }, "totalPoints", points)

    return contribution
  }

  async getContributionsByUserId(userId: string): Promise<Contribution[]> {
    return this.contributionRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    })
  }

  async getContributionsByType(type: ContributionType): Promise<Contribution[]> {
    return this.contributionRepository.find({
      where: { type },
      order: { createdAt: "DESC" },
    })
  }

  async getContributionsByDateRange(startDate: Date, endDate: Date): Promise<Contribution[]> {
    return this.contributionRepository
      .createQueryBuilder("contribution")
      .where("contribution.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .orderBy("contribution.createdAt", "DESC")
      .getMany()
  }
}

