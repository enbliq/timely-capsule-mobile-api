import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { UpdateCapsuleDto } from './dto/update-capsule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Capsule } from './entities/capsule.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';



@Injectable()
export class CapsuleService {
  constructor(
    @InjectRepository(Capsule) private readonly capsuleRepository: Repository<Capsule>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createCapsuleDto: CreateCapsuleDto): Promise<Capsule> {
    try {
      // Validate that createdBy is a valid number
      if (!createCapsuleDto.createdBy || typeof createCapsuleDto.createdBy !== 'number') {
        throw new Error('Invalid or missing createdBy ID');
      }
  
      // Find the user by its numeric ID
      const user = await this.userRepository.findOne({
        where: { id: createCapsuleDto.createdBy }, // Ensure ID is a number
      });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      // Create a new capsule instance
      const capsule = this.capsuleRepository.create({
        ...createCapsuleDto,
        createdBy: user, // Assign the user relation
      });
  
      // Save the capsule in the database
      return await this.capsuleRepository.save(capsule);
    } catch (error) {
      throw new Error(`Failed to create capsule: ${error.message}`);
    }
  }
  
  
  findAll() {
    return `This action returns all capsule`;
  }

  async findOneById(id: string): Promise<Capsule | null> {
    return this.capsuleRepository.findOne({ where: { id } });
  }

    public async update(id: string, updateCapsuleDto: CreateCapsuleDto) {
      // Find the existing capsule by ID
      const edit = await this.capsuleRepository.findOne({
          where: { id: id },
          relations: ['createdBy', 'accessLogs', 'transactions'], // Load related entities if needed
      });
  
      if (!edit) {
          throw new Error('Capsule not found');
      }
  
      // Update the properties of the capsule with the values from the DTO
      edit.title = updateCapsuleDto.title ?? edit.title;
      edit.content = updateCapsuleDto.content ?? edit.content;
      edit.media = updateCapsuleDto.media ?? edit.media;
      edit.password = updateCapsuleDto.password ?? edit.password;
      edit.recipientEmail = updateCapsuleDto.recipientEmail ?? edit.recipientEmail;
      edit.recipientLink = updateCapsuleDto.recipientLink ?? edit.recipientLink; 
      edit.fundId = updateCapsuleDto.fundId ?? edit.fundId;
      edit.isClaimed = updateCapsuleDto.isClaimed ?? edit.isClaimed; 
      edit.isGuest = updateCapsuleDto.isGuest ?? edit.isGuest; 
      // Note: createdBy is typically not updated, so it's not included here
  
      // Save the updated capsule back to the repository
      return this.capsuleRepository.save(edit);
  }
  
  async deleteCapsule(id: string) {
    const capsule = await this.findOneById(id);

    if (!capsule) {
      throw new NotFoundException('Capsule not found');
    }
    await this.capsuleRepository.softDelete(id); // Use remove(id) for permanent deletion
    return { message: 'Capsule deleted successfully' };
  }
}
