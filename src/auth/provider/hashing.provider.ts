import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  // hashing: happens during sign up
  abstract hashPassword(data: string | Buffer): Promise<string>;
  // compare: happens during sign in
  abstract comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean>;
}
