import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthenticationError extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}