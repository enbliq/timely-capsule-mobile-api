import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common"

@Injectable()
export class VerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest()

    if (!user) {
      return false
    }

    if (!user.isVerified) {
      throw new ForbiddenException("Email verification required")
    }

    return true
  }
}
