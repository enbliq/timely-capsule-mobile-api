import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PaginatedInterface } from 'src/common/pagination/interface/paginationInterface';
import { PaginationProvider } from 'src/common/pagination/provider/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQuery.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly paginationProvider: PaginationProvider,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  public findAllUsers(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedInterface<User>> {
    try {
      return this.paginationProvider.PaginatedQuery(
        paginationQueryDto,
        this.userRepository,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, 'Unable To Fetch User(s)');
    }
  }

  // Finding a Single User By Registered ID
  public findOneById(id: number): Promise<User> {
    try {
      const user = this.userRepository.findOneBy({ id });
      return user;
    } catch (error) {
      throw new NotFoundException({ description: error }, 'User Not Found');
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  // Deleting a User By Registered ID
  public deleteUser(id: number) {
    const user = this.userRepository.findOneBy({ id });

    if (user) {
      return this.userRepository.softDelete(id);
    } else {
      throw new NotFoundException('User Not Found');
    }
  }
}
