import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class FindOneById {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    public async findOneById(id: number): Promise<User> {
        let user: User | undefined;

        try {
            user = await this.userRepository.findOne({
                where: { id }, // Ensure ID is a number
            });
        } catch (error) {
            throw new RequestTimeoutException('Could not fetch user', {
                description: 'Error connecting to database',
            });
        }

        if (!user) {
            throw new UnauthorizedException('User does not exist');
        }

        return user; 
    }
}