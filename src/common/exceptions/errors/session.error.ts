import { HttpException, HttpStatus } from '@nestjs/common';

export class SessionError extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.FORBIDDEN);
    }
}