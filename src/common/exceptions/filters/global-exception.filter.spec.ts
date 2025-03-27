import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import { AuthenticationError } from '../errors/authentication.error';

describe('GlobalExceptionFilter', () => {
    let filter: GlobalExceptionFilter;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GlobalExceptionFilter],
        }).compile();

        filter = module.get<GlobalExceptionFilter>(GlobalExceptionFilter);
    });

    it('should format HttpException correctly', () => {
        const exception = new AuthenticationError('Invalid token');
        const host = {
            switchToHttp: () => ({
                getResponse: () => ({
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                }),
                getRequest: () => ({
                    url: '/example/error',
                    headers: { 'request-id': '12345' },
                }),
            }),
        } as ArgumentsHost;

        filter.catch(exception, host);

        expect(host.switchToHttp().getResponse().status).toHaveBeenCalledWith(401);
        expect(host.switchToHttp().getResponse().json).toHaveBeenCalledWith({
            statusCode: 401,
            message: 'Invalid token',
            error: 'AuthenticationError',
            timestamp: expect.any(String),
            path: '/example/error',
            requestId: '12345',
        });
    });
});