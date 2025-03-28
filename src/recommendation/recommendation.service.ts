// src/recommendations/recommendations.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Capsule } from '../capsules/entities/capsule.entity';
import { UserInteraction } from '../users/entities/user-interaction.entity';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Capsule)
    private capsulesRepository: Repository<Capsule>,
    @InjectRepository(UserInteraction)
    private userInteractionsRepository: Repository<UserInteraction>,
  ) {}

  async getRecommendationsForUser(userId: number, limit = 10): Promise<Capsule[]> {
    // Get user's interactions (liked/viewed capsules)
    const userInteractions = await this.userInteractionsRepository.find({
      where: { userId },
      relations: ['capsule'],
    });

    if (!userInteractions.length) {
      // If no interactions, return popular capsules
      return this.getPopularCapsules(limit);
    }

    // Extract capsule IDs and their categories/tags for similarity matching
    const interactedCapsuleIds = userInteractions.map(
      (interaction) => interaction.capsuleId,
    );
    
    // Get categories and tags from interacted capsules
    const interactedCapsules = await this.capsulesRepository.find({
      where: { id: { $in: interactedCapsuleIds } },
      relations: ['categories', 'tags'],
    });

    // Extract all category and tag IDs
    const categoryIds = new Set<number>();
    const tagIds = new Set<number>();
    
    interactedCapsules.forEach(capsule => {
      capsule.categories.forEach(category => categoryIds.add(category.id));
      capsule.tags.forEach(tag => tagIds.add(tag.id));
    });

    // Find similar capsules based on matching categories and tags
    const similarCapsules = await this.capsulesRepository
      .createQueryBuilder('capsule')
      .leftJoinAndSelect('capsule.categories', 'category')
      .leftJoinAndSelect('capsule.tags', 'tag')
      .where('category.id IN (:...categoryIds)', { 
        categoryIds: Array.from(categoryIds) 
      })
      .orWhere('tag.id IN (:...tagIds)', { 
        tagIds: Array.from(tagIds) 
      })
      .andWhere('capsule.id NOT IN (:...interactedCapsuleIds)', {
        interactedCapsuleIds,
      })
      .orderBy('RANDOM()') // Simple randomization for diversity
      .take(limit)
      .getMany();

    return similarCapsules;
  }

  private async getPopularCapsules(limit: number): Promise<Capsule[]> {
    // Fallback to popular capsules if no user interactions
    return this.capsulesRepository
      .createQueryBuilder('capsule')
      .leftJoin('capsule.interactions', 'interaction')
      .groupBy('capsule.id')
      .orderBy('COUNT(interaction.id)', 'DESC')
      .take(limit)
      .getMany();
  }

  // Calculate similarity score between capsules
  private calculateSimilarityScore(
    userCapsule: Capsule,
    candidateCapsule: Capsule,
  ): number {
    let score = 0;
    
    // Category matching
    userCapsule.categories.forEach(category => {
      if (candidateCapsule.categories.some(c => c.id === category.id)) {
        score += 2; // Categories are strong indicators
      }
    });
    
    // Tag matching
    userCapsule.tags.forEach(tag => {
      if (candidateCapsule.tags.some(t => t.id === tag.id)) {
        score += 1; // Tags provide additional signals
      }
    });
    
    return score;
  }
}