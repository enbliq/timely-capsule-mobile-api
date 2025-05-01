import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler } from "@nestjs/common"
import type { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import type { AuditService } from "../audit.service"

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, url, user, ip, headers } = request
    const userAgent = headers["user-agent"]

    // Skip audit logging for certain paths (like health checks)
    if (url.includes("/health") || url.includes("/metrics")) {
      return next.handle()
    }

    return next.handle().pipe(
      tap(() => {
        // Extract resource from URL
        const urlParts = url.split("/")
        const resource = urlParts[1] || "unknown"

        // Map HTTP method to action
        let action
        switch (method) {
          case "GET":
            action = "read"
            break
          case "POST":
            action = "create"
            break
          case "PATCH":
          case "PUT":
            action = "update"
            break
          case "DELETE":
            action = "delete"
            break
          default:
            action = method.toLowerCase()
        }

        // Create audit log
        this.auditService.create({
          action,
          resource,
          details: {
            url,
            method,
            body: method !== "GET" ? { ...request.body, password: undefined } : undefined,
            params: request.params,
            query: request.query,
          },
          userId: user?.userId,
          userEmail: user?.email,
          ipAddress: ip,
          userAgent,
        })
      }),
    )
  }
}
