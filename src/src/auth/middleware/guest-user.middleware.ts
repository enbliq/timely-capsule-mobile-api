import { Injectable, type NestMiddleware } from "@nestjs/common"
import type { Request, Response, NextFunction } from "express"
import type { AuthService } from "../auth.service"

@Injectable()
export class GuestUserMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // If the request has the createGuest flag and no user
    if (req.createGuest && !req.user) {
      try {
        // Create a guest user
        const guestAuth = await this.authService.createGuestUser()

        // Set the user in the request
        req.user = {
          userId: guestAuth.user._id,
          roles: guestAuth.user.roles,
          guest: true,
        }

        // Add the token to the response
        res.setHeader("X-Guest-Token", guestAuth.access_token)
      } catch (error) {
        console.error("Error creating guest user:", error)
      }
    }

    next()
  }
}
