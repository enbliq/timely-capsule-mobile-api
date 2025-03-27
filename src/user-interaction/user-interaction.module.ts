import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInteraction } from './entities/user-interaction.entity';
import { UserInteractionService } from './user-interaction.service';
import { UserInteractionController } from './user-interaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserInteraction])],
  providers: [UserInteractionService],
  controllers: [UserInteractionController],
  exports: [UserInteractionService],
})
export class UserInteractionModule {}