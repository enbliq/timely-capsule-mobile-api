import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { UpdateCapsuleDto } from './dto/update-capsule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Capsule } from './entities/capsule.entity';
import { Repository } from 'typeorm';
import { FindOneById } from './providers/findone';
import { UserService } from 'src/user/user.service';
import { HashingProvider } from 'src/auth/provider/hashing.provider';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class CapsuleService {
  constructor(
    @InjectRepository(Capsule)
    private readonly capsuleRepository: Repository<Capsule>,  // repo injection of capsule entity

    private readonly findOneByIdService: FindOneById,

    private readonly userService: UserService,

    private readonly hashingProvider: HashingProvider,
  ) {}

  async create(createCapsuleDto: CreateCapsuleDto): Promise<Capsule> {
    try {
      if (!createCapsuleDto || typeof createCapsuleDto.createdBy !== 'number') {
        throw new Error('Invalid or missing createdBy ID');
      }

      const user = await this.userService.findOneById(createCapsuleDto.createdBy);
      if (!user) {
        throw new Error('User not found');
      }

      if (createCapsuleDto.password) {
        createCapsuleDto.password = await this.hashingProvider.hashPassword(createCapsuleDto.password);
      }

      const capsule = this.capsuleRepository.create({
        ...createCapsuleDto,
        createdBy: user,
      });

      return await this.capsuleRepository.save(capsule);
    } catch (error) {
      throw new Error(`Failed to create capsule: ${error.message}`);
    }
  }

  //THIS FN FINDS ALL CAPSULES 
  async findAllCapsules(paginationDto: PaginationDto) {
    const { page, limits } = paginationDto; 
    const take = limits || 10; //set  limit to 10 capsules
    const skip = (page - 1) * take; //skip the first page

    const [result, total] = await this.capsuleRepository.findAndCount({ skip, take });

    return {
      data: result,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / take),
        currentPage: page,
        perPage: take,
      },
    };
  }

  async findOneById(id: number): Promise<Capsule | null> {
    return this.capsuleRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCapsuleDto: UpdateCapsuleDto) {
    const edit = await this.capsuleRepository.findOne({
      where: { id },
      relations: ['createdBy', 'accessLogs', 'transactions'],
    });

    if (!edit) {
      throw new NotFoundException('Capsule not found');
    }

    Object.assign(edit, updateCapsuleDto);

    if (updateCapsuleDto.password) {
      edit.password = await this.hashingProvider.hashPassword(updateCapsuleDto.password);
    }

    return this.capsuleRepository.save(edit);
  }

  async deleteCapsule(id: number) {
    const capsule = await this.findOneById(id);

    if (!capsule) {
      throw new NotFoundException('Capsule not found');
    }
    await this.capsuleRepository.softDelete(id);
    return { message: 'Capsule deleted successfully' };
  }
}