import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Streak } from "./entities/streak.entity"
import type { User } from "../users/entities/user.entity"

@Injectable()
export class StreaksService {
  constructor(
    @InjectRepository(Streak)
    private streaksRepository: Repository<Streak>,
  ) {}

  async getStreakByUserId(userId: number): Promise<Streak> {
    return this.streaksRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    })
  }

  async updateStreakAfterCapsuleCreation(user: User): Promise<Streak> {
    let streak = await this.getStreakByUserId(user.id)

    if (!streak) {
      streak = this.streaksRepository.create({
        currentStreak: 1,
        longestStreak: 1,
        lastCapsuleDate: new Date(),
        user,
      })
      return this.streaksRepository.save(streak)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastCapsuleDate = streak.lastCapsuleDate

    if (!lastCapsuleDate) {
      // First time creating a capsule
      streak.currentStreak = 1
      streak.longestStreak = 1
      streak.lastCapsuleDate = new Date()
    } else {
      const lastDate = new Date(lastCapsuleDate)
      lastDate.setHours(0, 0, 0, 0)

      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastDate.getTime() === today.getTime()) {
        // Already created a capsule today, no streak update
      } else if (lastDate.getTime() === yesterday.getTime()) {
        // Created a capsule yesterday, increment streak
        streak.currentStreak += 1
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak
        }
        streak.lastCapsuleDate = new Date()
      } else {
        // Missed a day, reset streak
        streak.currentStreak = 1
        streak.lastCapsuleDate = new Date()
      }
    }

    return this.streaksRepository.save(streak)
  }
}

