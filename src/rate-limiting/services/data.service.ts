import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { DataEntity } from "../entities/data.entity"
import type { CreateDataDto } from "../dto/create-data.dto"
import type { PaginationDto } from "../dto/pagination.dto"

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(DataEntity)
    private dataRepository: Repository<DataEntity>,
  ) {}

  async create(createDataDto: CreateDataDto): Promise<DataEntity> {
    const newData = this.dataRepository.create(createDataDto)
    return this.dataRepository.save(newData)
  }

  async findAll(paginationDto: PaginationDto): Promise<{ data: DataEntity[]; total: number }> {
    const { page = 1, limit = 10, sortBy = "createdAt", order = "DESC" } = paginationDto

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Build query with pagination and sorting
    const [data, total] = await this.dataRepository.findAndCount({
      skip,
      take: limit,
      order: { [sortBy]: order },
    })

    return { data, total }
  }

  async findOne(id: string): Promise<DataEntity> {
    return this.dataRepository.findOne({ where: { id } })
  }
}

