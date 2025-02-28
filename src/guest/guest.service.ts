import { Injectable } from '@nestjs/common';
import { GuestCapsuleAccessLogDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GuestCapsuleAccessLog } from './entities/guest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(GuestCapsuleAccessLog)
    private readonly guestCapsuleAccessLogRepository: Repository<GuestCapsuleAccessLog>,
    private readonly guestCapsuleAccessLog: GuestCapsuleAccessLog,
  ) {}
  create(createGuestDto: GuestCapsuleAccessLogDto) {
    return 'This action adds a new guest';
  }

  public async findAll(
    limit: number,
    page: number,
  ): Promise<GuestCapsuleAccessLog[]> {
    const skip = (page - 1) * limit;

    return this.guestCapsuleAccessLogRepository.find({
      skip,
      take: limit,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} guest`;
  }

  update(id: number, updateGuestDto: UpdateGuestDto) {
    return `This action updates a #${id} guest`;
  }

  remove(id: number) {
    return `This action removes a #${id} guest`;
  }
}
