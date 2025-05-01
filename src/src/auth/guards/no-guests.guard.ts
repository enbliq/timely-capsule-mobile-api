import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common"
import type { Reflector } from "@nestjs/core"
import { GUEST_ALLOWED_KEY } from "../decorators/guest-allowed.decorator"

@Injectable()
export class NoGuestsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const guestAllowed = this.reflector.getAllAndOverride<boolean>(GUEST_ALLOWED_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (guestAllowed) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    if (!user) {
      return false
    }

    if (user.guest) {
      throw new ForbiddenException("This action requires a registered account")
    }

    return true
  }
}
