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
    edit.unlockAt = updateCapsuleDto.unlockAt ?? edit.unlockAt;
    edit.expiresAt = updateCapsuleDto.expiresAt ?? edit.expiresAt; 
    edit.fundId = updateCapsuleDto.fundId ?? edit.fundId;
    edit.isClaimed = updateCapsuleDto.isClaimed ?? edit.isClaimed; 
    edit.isGuest = updateCapsuleDto.isGuest ?? edit.isGuest; 
    // Note: createdBy is typically not updated, so it's not included here

    // Save the updated capsule back to the repository
    return this.capsuleRepository.save(edit);
}

}
