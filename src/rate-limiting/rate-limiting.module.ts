import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimitingController } from './controllers/rate-limiting.controller';
import { DataService } from './services/data.service';
import { UserEntity } from './entities/user.entity';
import { DataEntity } from './entities/data.entity';
import { RateLimitingGuard } from './throttle/rate-limiting.guard';
import { RedisCacheService } from './cache/redis-cache.service';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // Rate limiting configuration - 10 requests per second per user
    ThrottlerModule.forRoot([
      {
        ttl: 1000, // 1 second
        limit: 10, // 10 requests
      },
    ]),

    // Redis cache configuration
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: Number.parseInt(process.env.REDIS_PORT || '6379'),
          },
          ttl: 60 * 1000, // 1 minute default TTL
        }),
      }),
    }),

    // Database entities
    TypeOrmModule.forFeature([UserEntity, DataEntity]),
  ],
  controllers: [RateLimitingController],
  providers: [
    DataService,
    RedisCacheService,
    {
      provide: APP_GUARD,
      useClass: RateLimitingGuard,
    },
  ],
  exports: [DataService, RedisCacheService],
})
export class RateLimitingModule {}
