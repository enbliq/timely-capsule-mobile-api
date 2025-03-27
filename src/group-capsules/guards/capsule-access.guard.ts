import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common"
import type { Reflector } from "@nestjs/core"
import type { GroupCapsulesService } from "../group-capsules.service"

@Injectable()
export class CapsuleAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private groupCapsulesService: GroupCapsulesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    const capsuleId = request.params.id

    if (!user || !capsuleId) {
      return false
    }

    const requiredRole = this.reflector.get<string>("role", context.getHandler())

    const capsule = await this.groupCapsulesService.findOne(capsuleId)

    if (!capsule) {
      return false
    }

    // Owner has full access
    if (capsule.ownerId === user.id) {
      return true
    }

    // Check if user is a contributor
    if (requiredRole === "contributor") {
      const isContributor = capsule.contributors.some((contributor) => contributor.id === user.id)

      if (!isContributor) {
        throw new ForbiddenException("You are not a contributor to this capsule")
      }

      return isContributor
    }

    // Check if user is a viewer
    if (requiredRole === "viewer") {
      const isViewer = capsule.viewers.some((viewer) => viewer.id === user.id)
      const isContributor = capsule.contributors.some((contributor) => contributor.id === user.id)

      if (!isViewer && !isContributor) {
        throw new ForbiddenException("You do not have access to this capsule")
      }

      return isViewer || isContributor
    }

    return false
  }
}

