import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
    // hashing during signUp
    abstract hashPassword(inpPassword: string | Buffer): Promise<string>
}