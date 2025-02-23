import { Injectable } from '@nestjs/common';
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
    return 'This action adds a new capsule';
  }

  findAll() {
    return `This action returns all capsule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} capsule`;
  }

  update(id: number, updateCapsuleDto: UpdateCapsuleDto) {
    return `This action updates a #${id} capsule`;
  }

  remove(id: number) {
    return `This action removes a #${id} capsule`;
  }
}
