import { Injectable, type NestMiddleware } from "@nestjs/common"
import type { Request, Response, NextFunction } from "express"
import * as helmet from "helmet"
import * as rateLimit from "express-rate-limit"
import * as xss from "xss-clean"
import * as hpp from "hpp"

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private helmet = helmet()
  private rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later",
  })
  private xssClean = xss()
  private hpp = hpp()

  use(req: Request, res: Response, next: NextFunction) {
    // Apply helmet (sets various HTTP headers for security)
    this.helmet(req, res, (err: any) => {
      if (err) return next(err)

      // Apply rate limiting
      this.rateLimiter(req, res, (err: any) => {
        if (err) return next(err)

        // Apply XSS protection
        this.xssClean(req, res, (err: any) => {
          if (err) return next(err)

          // Apply protection against HTTP Parameter Pollution
          this.hpp(req, res, next)
        })
      })
    })
  }
}
