import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from '../content/entities/content.entity';
import { UserAction } from '../user-behavior/entities/user-action.entity';

// Define constants for action types and weights
const CONTENT_TARGET_TYPE = 'content';
const ACTION_WEIGHTS = {
  'view': 1,
  'like': 3,
  'bookmark': 5,
  'share': 4,
  'comment': 2,
};

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    @InjectRepository(UserAction)
    private userActionRepository: Repository<UserAction>,
  ) {}

  // Get recommendations for a specific user
  async getRecommendationsForUser(userId: number, limit: number = 10): Promise<Content[]> {
    // 1. Get user's past actions on content
    const userActions = await this.userActionRepository.find({
      where: { 
        userId: userId,
        targetType: CONTENT_TARGET_TYPE
      }
    });

    // 2. Extract content IDs the user has interacted with
    const interactedContentIds = userActions.map(action => action.targetId);
    
    // 3. Extract user preferences (categories) based on content they've interacted with
    const userPreferences = await this.extractUserPreferences(userActions);

    // 4. Get content the user hasn't interacted with yet
    const candidateContent = await this.contentRepository.find({
      where: { 
        id: { $not: { $in: interactedContentIds } } as any,
      }
    });

    // 5. Score each content item based on user preferences
    const scoredContent = candidateContent.map(content => {
      const score = this.calculateContentScore(content, userPreferences);
      return { content, score };
    });

    // 6. Sort by score and return top recommendations
    return scoredContent
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.content);
  }

  // Extract user preferences based on interactions
  private async extractUserPreferences(userActions: UserAction[]): Promise<Map<string, number>> {
    const preferences = new Map<string, number>();
    
    // Get all the content items the user has interacted with
    const contentIds = userActions.map(action => parseInt(action.targetId));
    const interactedContent = await this.contentRepository.findByIds(contentIds);
    
    // Create a map of content id to content for quick lookup
    const contentMap = new Map<number, Content>();
    interactedContent.forEach(content => {
      contentMap.set(content.id, content);
    });
    
    // Calculate preferences based on actions and content categories
    userActions.forEach(action => {
      const contentId = parseInt(action.targetId);
      const content = contentMap.get(contentId);
      
      if (!content) return; // Skip if content not found
      
      const weight = ACTION_WEIGHTS[action.action] || 1; // Default weight 1 if action not found
      
      content.categories.forEach(category => {
        const currentWeight = preferences.get(category) || 0;
        preferences.set(category, currentWeight + weight);
      });
    });
    
    return preferences;
  }

  // Calculate content score based on user preferences
  private calculateContentScore(content: Content, preferences: Map<string, number>): number {
    let score = 0;
    
    content.categories.forEach(category => {
      if (preferences.has(category)) {
        score += preferences.get(category);
      }
    });
    
    // Consider recency as a factor (newer content gets a small boost)
    const contentAge = (new Date().getTime() - content.createdAt.getTime()) / (1000 * 60 * 60 * 24); // age in days
    const recencyBoost = Math.max(0, 1 - (contentAge / 30)); // Boost for content less than 30 days old
    
    return score * (1 + recencyBoost * 0.2); // 20% boost maximum for very recent content
  }

  // Get collaborative filtering recommendations
  async getCollaborativeRecommendations(userId: number, limit: number = 10): Promise<Content[]> {
    // Find similar users
    const similarUserIds = await this.getSimilarUserIds(userId, 5);
    
    // Get content that the user hasn't interacted with but similar users have
    const userActions = await this.userActionRepository.find({
      where: { 
        userId: userId,
        targetType: CONTENT_TARGET_TYPE
      }
    });
    
    const userContentIds = userActions.map(action => action.targetId);
    
    const similarUserActions = await this.userActionRepository.find({
      where: {
        userId: { $in: similarUserIds } as any,
        targetType: CONTENT_TARGET_TYPE,
        targetId: { $not: { $in: userContentIds } } as any,
      }
    });
    
    // Count content popularity among similar users
    const contentScoreMap = new Map<string, number>();
    
    similarUserActions.forEach(action => {
      const contentId = action.targetId;
      const currentScore = contentScoreMap.get(contentId) || 0;
      const actionWeight = ACTION_WEIGHTS[action.action] || 1;
      
      contentScoreMap.set(contentId, currentScore + actionWeight);
    });
    
    // Get the top-scoring content
    const recommendedContentIds = Array.from(contentScoreMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(entry => parseInt(entry[0]));
    
    return this.contentRepository.findByIds(recommendedContentIds);
  }

  // Find users with similar interaction patterns
  private async getSimilarUserIds(userId: number, limit: number = 5): Promise<number[]> {
    // Get content IDs the target user has interacted with
    const userActions = await this.userActionRepository.find({
      where: { 
        userId: userId,
        targetType: CONTENT_TARGET_TYPE
      }
    });
    
    const userContentIds = userActions.map(action => action.targetId);
    
    // Find actions from other users on the same content
    const similarUserActions = await this.userActionRepository.find({
      where: {
        userId: { $ne: userId } as any,
        targetType: CONTENT_TARGET_TYPE,
        targetId: { $in: userContentIds } as any,
      }
    });
    
    // Count shared interactions by user
    const userSimilarityMap = new Map<number, number>();
    
    similarUserActions.forEach(action => {
      const currentCount = userSimilarityMap.get(action.userId) || 0;
      const actionWeight = ACTION_WEIGHTS[action.action] || 1;
      
      userSimilarityMap.set(action.userId, currentCount + actionWeight);
    });
    
    // Return the most similar users
    return Array.from(userSimilarityMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(entry => entry[0]);
  }
}