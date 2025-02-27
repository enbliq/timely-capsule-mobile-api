import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { UpdateCapsuleDto } from './dto/update-capsule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Capsule } from './entities/capsule.entity';
import { Repository } from 'typeorm';


@Injectable()
export class CapsuleService {
  constructor(
    @InjectRepository(Capsule) private readonly capsuleRepository: Repository<Capsule>,
  ) {}
  create(createCapsuleDto: CreateCapsuleDto) {
    return 'Capsule Created succefully'
  }

  findAll() {
    return `This action returns all capsule`;
  }

  async findOneById(id: string): Promise<Capsule | null> {
    return this.capsuleRepository.findOne({ where: { id } });
  }

  update(id: number, updateCapsuleDto: UpdateCapsuleDto) {
    return `This action updates a #${id} capsule`;
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
