import { Injectable } from '@nestjs/common';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { UpdateCapsuleDto } from './dto/update-capsule.dto';

@Injectable()
export class CapsuleService {
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
