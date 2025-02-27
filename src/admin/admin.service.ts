/* eslint-disable prettier/prettier */
import { Injectable,  BadRequestException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Capsule } from 'src/capsule/entities/capsule.entity';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query-dto.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Capsule)
    private readonly capsuleRepository: Repository<Capsule>,
    private readonly paginationService: PaginationService
  ) {}

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  async findAllCapsules(
    paginationQueryDto: PaginationQueryDto,
    months?: number
  ) {
    if (months !== undefined) {
      if (isNaN(months) || months <= 0) {
        throw new BadRequestException('Months must be a positive integer.');
      }
    }

    const filter: any = {};
    
    if (months) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      filter.createdAt = MoreThanOrEqual(startDate); // Use TypeORM's MoreThanOrEqual
    }

    return this.paginationService.paginationQuery(paginationQueryDto, this.capsuleRepository);
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
