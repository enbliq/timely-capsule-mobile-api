import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserBehaviorController } from './user-behavior.controller';
import { UserBehaviorService } from './user-behavior.service';
import { UserAction } from './entities/user-action.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAction]), ConfigModule],
  controllers: [UserBehaviorController],
  providers: [UserBehaviorService],
  exports: [UserBehaviorService],
})
export class UserBehaviorModule {}
