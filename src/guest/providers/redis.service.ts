import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setGuestSession(guestId: string) {
    await this.cacheManager.set(`guest_session:${guestId}`, 'active', 600 ); // 10 min expiry
  }

  async getGuestSession(guestId: string): Promise<string | undefined> {
    return await this.cacheManager.get(`guest_session:${guestId}`);
  }

  async deleteGuestSession(guestId: string) {
    await this.cacheManager.del(`guest_session:${guestId}`);
  }
}
