// src/recommendations/recommendations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { Capsule } from '../capsules/entities/capsule.entity';
import { UserInteraction } from '../users/entities/user-interaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Capsule, UserInteraction])],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}