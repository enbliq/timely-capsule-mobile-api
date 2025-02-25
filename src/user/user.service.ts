import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HashingProvider } from '../auth/provider/hashing.provider';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    private readonly hashingProvider: HashingProvider,

  ) {}

  // THIS IS TO SIGNUP TO ENABLE EDIT LOGIC 
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with this email already exists
    const existingUser = await this.userRepository.findOne({ 
      where: { email: createUserDto.email } 
    });
    
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Create new user entity
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.passwordHash = await this.hashingProvider.hashPassword(createUserDto.password);
    user.profilePicture = createUserDto.profilePicture;
    user.isGuest = createUserDto.isGuest ?? false;
    user.subscriptionTier = createUserDto.subscriptionTier ?? 'free';
    user.walletAddress = createUserDto.walletAddress;
    user.createdAt = new Date();
    user.lastLogin = new Date();

    // Save and return new user (without passwordHash)
    const savedUser = await this.userRepository.save(user);
    const { passwordHash, ...result } = savedUser;
    return result as User;
  }

  // THIS IS TO SEE ALL USERS TO SEE ID
  findAll() {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'profilePicture', 'isGuest', 'subscriptionTier', 'walletAddress']
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }


  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log(`Updating user ${id} without auth check`);
    
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: Number(id) } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Handle password update separately
    if (updateUserDto.password) {
      console.log('Updating password');
      user.passwordHash = await this.hashingProvider.hashPassword(updateUserDto.password);
      delete updateUserDto.password;
    }

    // Update other fields
    console.log('Updating other fields');
    Object.assign(user, updateUserDto);

    // Save and return updated user
    console.log('Saving user');
    const updatedUser = await this.userRepository.save(user);
    console.log('User updated successfully');
    
    const { passwordHash, ...result } = updatedUser;
    return result;
  }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
