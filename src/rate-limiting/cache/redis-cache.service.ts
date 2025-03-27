import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async clearCache(keyPattern: string): Promise<void> {
    // This is a simplified version - in a real implementation,
    // you would use Redis client directly to delete by pattern
    await this.cacheManager.del(keyPattern);
  }

  // Method to pre-cache frequently accessed data
  async preCacheData(
    key: string,
    dataFn: () => Promise<any>,
    ttl?: number,
  ): Promise<any> {
    const cachedData = await this.get(key);

    if (cachedData) {
      return cachedData;
    }

    const data = await dataFn();
    await this.set(key, data, ttl);

    return data;
  }
}
