import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashingProvider } from './hashing';

@Injectable()
export class BcryptProvider implements HashingProvider{
    // hashing of passord
    public async hashPassword(inpPassword: string | Buffer): Promise<string> {
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        
        return await bcrypt.hash(inpPassword, salt) 
    }
}