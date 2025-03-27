import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInteraction, InteractionType } from './entities/user-interaction.entity';
import { CreateUserInteractionDto } from './dto/create-user-interaction.dto';

@Injectable()
export class UserInteractionService {
  private readonly logger = new Logger(UserInteractionService.name);

  constructor(
    @InjectRepository(UserInteraction)
    private userInteractionRepository: Repository<UserInteraction>,
  ) {}

  async create(createUserInteractionDto: CreateUserInteractionDto): Promise<UserInteraction> {
    try {
      const userInteraction = this.userInteractionRepository.create(createUserInteractionDto);
      return await this.userInteractionRepository.save(userInteraction);
    } catch (error) {
      this.logger.error(`Failed to create user interaction: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByUser(userId: number): Promise<UserInteraction[]> {
    try {
      return await this.userInteractionRepository.find({
        where: { userId },
        relations: ['capsule'],
      });
    } catch (error) {
      this.logger.error(`Failed to find interactions for user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByCapsule(capsuleId: number): Promise<UserInteraction[]> {
    try {
      return await this.userInteractionRepository.find({
        where: { capsuleId },
        relations: ['user'],
      });
    } catch (error) {
      this.logger.error(`Failed to find interactions for capsule ${capsuleId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getRecentInteractions(limit: number = 10): Promise<UserInteraction[]> {
    try {
      return await this.userInteractionRepository.find({
        order: { timestamp: 'DESC' },
        take: limit,
        relations: ['user', 'capsule'],
      });
    } catch (error) {
      this.logger.error(`Failed to get recent interactions: ${error.message}`, error.stack);
      throw error;
    }
  }
}