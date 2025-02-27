import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { RedisService } from './redis.service'; // Replace with actual Redis service
import { Request } from 'express';

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const guestId = request.headers['guest-id'];

    if (!guestId) {
      throw new UnauthorizedException('Guest ID is missing');
    }

    // Check Redis for session
    const session = await this.redisService.getGuestSession(`guest_session:${guestId}`);
    
    if (!session) {
      throw new ForbiddenException('Guest session expired');
    }

    return true;
  }
}
