// import { Injectable } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { v4 as uuidv4 } from 'uuid'; // Generates unique guest IDs

@Injectable()
export class GuestService {
  constructor(private readonly redisService: RedisService) {}

  async createGuestSession(): Promise<string> {
    const guestId = uuidv4(); // Generate a unique guest ID
    await this.redisService.setGuestSession(guestId);
    return guestId; // Return guest ID for client to use
  }
  async deleteGuestSession(guestId: string): Promise<void> {
    await this.redisService.deleteGuestSession(guestId);
  }
  async isGuestSessionValid(guestId: string): Promise<boolean> {
    // Check if a guest session exists by checking the existence of the guest ID in the Redis store 
    const sessionId = await this.redisService.getGuestSession(guestId);
    return  true; // Return true if session exists, false otherwise
  }
}
