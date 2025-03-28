import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CapsuleHistory } from './entities/capsule-history.entity';
import { CreateCapsuleHistoryDto } from './dto/create-capsule-history.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CapsuleService } from 'src/capsule/capsule.service';

@Injectable()
export class CapsuleHistoryService {
  constructor(
    @InjectRepository(CapsuleHistory)
    private readonly historyRepository: Repository<CapsuleHistory>,
    private readonly userService: UserService,
    private readonly capsuleService: CapsuleService,
  ) {}

  async create(dto: CreateCapsuleHistoryDto, actor: User): Promise<CapsuleHistory> {
    const capsule = await this.capsuleService.findOne(dto.capsuleId);
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${dto.capsuleId} not found`);
    }

    const historyEntry = this.historyRepository.create({
      actionType: dto.actionType,
      changes: dto.changes,
      notes: dto.notes,
      actor,
      capsule,
    });

    if (dto.previousOwnerId) {
      historyEntry.previousOwner = await this.userService.findOne(dto.previousOwnerId);
    }

    if (dto.newOwnerId) {
      historyEntry.newOwner = await this.userService.findOne(dto.newOwnerId);
    }

    return this.historyRepository.save(historyEntry);
  }

  async findByCapsuleId(capsuleId: string): Promise<CapsuleHistory[]> {
    const history = await this.historyRepository.find({
      where: { capsule: { id: capsuleId } },
      relations: ['actor', 'previousOwner', 'newOwner'],
      order: { timestamp: 'DESC' },
    });

    if (!history.length) {
      throw new NotFoundException(`No history found for capsule with ID ${capsuleId}`);
    }

    return history;
  }
}
