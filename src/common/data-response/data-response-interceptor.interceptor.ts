import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Check for file streams or downloads (don't transform them)
    if (
      response.getHeader('Content-Type')?.toString().includes('application/octet-stream') ||
      response.getHeader('Content-Disposition')
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        message: response.statusMessage || 'Request successful',
      })),
    );
  }
}
