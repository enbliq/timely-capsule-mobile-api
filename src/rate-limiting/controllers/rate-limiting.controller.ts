import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import type { DataService } from '../services/data.service';
import type { CreateDataDto } from '../dto/create-data.dto';
import type { PaginationDto } from '../dto/pagination.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Throttle } from '@nestjs/throttler';
import type { RedisCacheService } from '../cache/redis-cache.service';

@Controller('data')
export class RateLimitingController {
  constructor(
    private readonly dataService: DataService,
    private readonly cacheService: RedisCacheService,
  ) {}

  // Custom rate limit for this endpoint
  @Throttle({ default: { limit: 5, ttl: 1000 } })
  @Post()
  async create(@Body() createDataDto: CreateDataDto) {
    // Clear cache when new data is created
    await this.cacheService.clearCache('data_list');
    return this.dataService.create(createDataDto);
  }

  // Use cache for this endpoint
  @UseInterceptors(CacheInterceptor)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.dataService.findAll(paginationDto);
  }

  // Cache specific item by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cacheKey = `data_${id}`;

    // Try to get from cache first
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, get from database and cache it
    const data = await this.dataService.findOne(id);
    await this.cacheService.set(cacheKey, data, 60 * 5); // Cache for 5 minutes

    return data;
  }
}
