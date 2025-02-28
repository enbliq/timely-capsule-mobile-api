import { Injectable, type ExecutionContext } from "@nestjs/common"
import { ThrottlerGuard } from "@nestjs/throttler"

@Injectable()
export class RateLimitingGuard extends ThrottlerGuard {
  // Override to extract user identifier for per-user rate limiting
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Get user ID from request (assuming authentication is in place)
    // If no user ID is available, fall back to IP address
    const userId = req.user?.id || "anonymous"
    const ip = req.ip

    // Combine user ID and IP for more precise tracking
    return `${userId}_${ip}`
  }

  // Custom handler for when rate limit is exceeded
  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
    throttler: Record<string, unknown>,
  ): Promise<boolean> {
    // Add custom logging or monitoring here
    const tracker = await this.getTracker(context.switchToHttp().getRequest())
    console.log(`Rate limit check for: ${tracker}, limit: ${limit}, ttl: ${ttl}`)

    return super.handleRequest(context, limit, ttl, throttler)
  }
}

