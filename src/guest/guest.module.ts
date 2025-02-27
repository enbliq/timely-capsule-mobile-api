/* eslint-disable prettier/prettier */
import { GuestService } from './providers/guest.service';
import { GuestController } from './guest.controller';
import { RedisService } from './providers/redis.service';
import { GuestGuard } from './providers/guest.guard';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestCapsuleAccessLog } from './entities/guest.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([GuestCapsuleAccessLog]),CacheModule.register(),],
  controllers: [GuestController],
  providers: [GuestService, RedisService, GuestGuard],
})
export class GuestModule {}