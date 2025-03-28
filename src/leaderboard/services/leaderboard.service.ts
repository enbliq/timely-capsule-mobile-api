import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { User } from "../entities/user.entity"
import { Contribution } from "../entities/contribution.entity"
import { type LeaderboardFilterDto, TimeRange } from "../dtos/leaderboard-filter.dto"
import type { LeaderboardResponseDto, LeaderboardUserDto } from "../dtos/leaderboard-response.dto"

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Contribution)
    private contributionRepository: Repository<Contribution>,
  ) {}

  async getLeaderboard(filterDto: LeaderboardFilterDto): Promise<LeaderboardResponseDto> {
    const { timeRange, page, limit } = filterDto
    const skip = (page - 1) * limit

    // Create query builder for contributions
    const queryBuilder = this.contributionRepository
      .createQueryBuilder("contribution")
      .leftJoinAndSelect("contribution.user", "user")
      .select("user.id", "userId")
      .addSelect("user.username", "username")
      .addSelect("user.avatarUrl", "avatarUrl")
      .addSelect("SUM(contribution.points)", "points")

    // Apply time range filter
    if (timeRange !== TimeRange.ALL_TIME) {
      const now = new Date()
      let startDate: Date

      if (timeRange === TimeRange.WEEKLY) {
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
      } else if (timeRange === TimeRange.MONTHLY) {
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
      }

      queryBuilder.andWhere("contribution.createdAt >= :startDate", { startDate })
    }

    // Group by user and order by points
    queryBuilder.groupBy("user.id").orderBy("points", "DESC").addOrderBy("user.username", "ASC")

    // Get total count for pagination
    const totalQuery = queryBuilder.clone()
    const totalCount = await totalQuery.getCount()

    // Apply pagination
    queryBuilder.offset(skip).limit(limit)

    // Execute query
    const results = await queryBuilder.getRawMany()

    // Transform results to DTO format
    const users: LeaderboardUserDto[] = results.map((result, index) => ({
      id: result.userId,
      username: result.username,
      avatarUrl: result.avatarUrl,
      points: Number.parseInt(result.points, 10),
      rank: skip + index + 1,
    }))

    return {
      users,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    }
  }

  async getUserRank(userId: string, timeRange: TimeRange = TimeRange.ALL_TIME): Promise<number> {
    // Create query builder for contributions
    const queryBuilder = this.contributionRepository
      .createQueryBuilder("contribution")
      .leftJoinAndSelect("contribution.user", "user")
      .select("user.id", "userId")
      .addSelect("SUM(contribution.points)", "points")

    // Apply time range filter
    if (timeRange !== TimeRange.ALL_TIME) {
      const now = new Date()
      let startDate: Date

      if (timeRange === TimeRange.WEEKLY) {
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
      } else if (timeRange === TimeRange.MONTHLY) {
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
      }

      queryBuilder.andWhere("contribution.createdAt >= :startDate", { startDate })
    }

    // Group by user and order by points
    queryBuilder.groupBy("user.id").orderBy("points", "DESC").addOrderBy("user.username", "ASC")

    // Execute query
    const results = await queryBuilder.getRawMany()

    // Find user's rank
    const userIndex = results.findIndex((result) => result.userId === userId)
    return userIndex !== -1 ? userIndex + 1 : -1
  }

  async getUserStats(userId: string): Promise<{
    totalPoints: number
    weeklyPoints: number
    monthlyPoints: number
    weeklyRank: number
    monthlyRank: number
    allTimeRank: number
  }> {
    // Get user's total points
    const user = await this.userRepository.findOne({ where: { id: userId } })
    const totalPoints = user ? user.totalPoints : 0

    // Calculate weekly points
    const weeklyStartDate = new Date()
    weeklyStartDate.setDate(weeklyStartDate.getDate() - 7)

    const weeklyPoints = await this.calculatePointsInRange(userId, weeklyStartDate, new Date())

    // Calculate monthly points
    const monthlyStartDate = new Date()
    monthlyStartDate.setMonth(monthlyStartDate.getMonth() - 1)

    const monthlyPoints = await this.calculatePointsInRange(userId, monthlyStartDate, new Date())

    // Get ranks
    const weeklyRank = await this.getUserRank(userId, TimeRange.WEEKLY)
    const monthlyRank = await this.getUserRank(userId, TimeRange.MONTHLY)
    const allTimeRank = await this.getUserRank(userId, TimeRange.ALL_TIME)

    return {
      totalPoints,
      weeklyPoints,
      monthlyPoints,
      weeklyRank,
      monthlyRank,
      allTimeRank,
    }
  }

  private async calculatePointsInRange(userId: string, startDate: Date, endDate: Date): Promise<number> {
    const result = await this.contributionRepository
      .createQueryBuilder("contribution")
      .select("SUM(contribution.points)", "total")
      .where("contribution.userId = :userId", { userId })
      .andWhere("contribution.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .getRawOne()

    return result.total ? Number.parseInt(result.total, 10) : 0
  }
}

