import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let statusCode: number;
        let message: string;
        let error: string;

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            message = exception.message;
            error = exception.constructor.name;
        } else {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal Server Error';
            error = 'InternalServerError';
        }

        const errorResponse: ErrorResponse = {
            statusCode,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
            requestId: request.headers['request-id'] as string,
        };

        // Log the error for debugging purposes
        console.error(`Error: ${error}, Message: ${message}, Path: ${request.url}`);

        response.status(statusCode).json(errorResponse);
    }
}