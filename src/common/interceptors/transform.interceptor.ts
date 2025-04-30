import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler } from "@nestjs/common"
import type { Observable } from "rxjs"
import { map } from "rxjs/operators"

export interface Response<T> {
  data: T
  meta?: any
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already structured with data and meta, return as is
        if (data && data.data !== undefined && data.meta !== undefined) {
          return data
        }

        // If pagination data is present
        if (data && data.items && data.total !== undefined) {
          return {
            data: data.items,
            meta: {
              total: data.total,
              page: data.page || 1,
              limit: data.limit || data.items.length,
              totalPages: Math.ceil(data.total / (data.limit || data.items.length)),
            },
          }
        }

        // Default transformation
        return {
          data,
          meta: {
            timestamp: new Date().toISOString(),
          },
        }
      }),
    )
  }
}
