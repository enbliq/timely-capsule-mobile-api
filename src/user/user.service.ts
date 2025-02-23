import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserService } from './providers/create-user.service';

@Injectable()
export class UserService {
  constructor(
    /**
     * inject createUserService
     */
    private readonly createUserService: CreateUserService,
  ) {}
  createUser(createUserDto: CreateUserDto) {
    return this.createUserService.createUser(createUserDto);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
