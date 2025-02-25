import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: any;
}
import { ActivityLogService } from 'src/activity-log/activity-log.service';

export class ActivityLoggerMiddleware implements NestMiddleware {
  constructor(private readonly activityLogService: ActivityLogService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const user = req.user as any;
    if (user) {
      await this.activityLogService.logActivity(
        user.id,
        `${req.method} ${req.url}`,
        req.ip,
      );
    }
    next();
  }
}
