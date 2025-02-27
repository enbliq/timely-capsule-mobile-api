/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Capsule } from 'src/capsule/entities/capsule.entity';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query-dto.dto';
import { BadRequestException } from '@nestjs/common';

describe('AdminService', () => {
  let service: AdminService;
  let capsuleRepository: Repository<Capsule>;
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Capsule),
          useClass: Repository, // Mock TypeORM Repository
        },
        {
          provide: PaginationService,
          useValue: {
            paginationQuery: jest.fn(), // Mock PaginationService method
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    capsuleRepository = module.get<Repository<Capsule>>(getRepositoryToken(Capsule));
    paginationService = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all capsules when no months filter is applied', async () => {
    const paginationDto: PaginationQueryDto = { page: 1, limit: 10 };
    const mockCapsules = [{ id: 1, createdAt: new Date() }];

    jest.spyOn(paginationService, 'paginationQuery').mockResolvedValue({
      data: mockCapsules,
      meta: { 
        itemsPerPage: 10, 
        totalItemsPerPage: 1, // ✅ Updated key name
        currentPage: 1, 
        totalPages: 1 
      },
      links: {
        firstPage: 'http://localhost:3000/capsules?page=1&limit=10',
        lastPage: 'http://localhost:3000/capsules?page=1&limit=10',
        currentPage: 'http://localhost:3000/capsules?page=1&limit=10',
        previousPage: null,
        nextPage: null,
      },
    });

    const result = await service.findAllCapsules(paginationDto);
    
    expect(paginationService.paginationQuery).toHaveBeenCalledWith(
      paginationDto,
      capsuleRepository
    );
    expect(result.data).toEqual(mockCapsules);
    expect(result.meta.totalItemsPerPage).toEqual(1); // ✅ Updated expectation
  });

  it('should return capsules from the last X months when months filter is applied', async () => {
    const paginationDto: PaginationQueryDto = { page: 1, limit: 10 };
    const months = 3;
    const mockCapsules = [{ id: 1, createdAt: new Date() }];

    jest.spyOn(paginationService, 'paginationQuery').mockResolvedValue({
      data: mockCapsules,
      meta: { 
        itemsPerPage: 10, 
        totalItemsPerPage: 1, // ✅ Updated key name
        currentPage: 1, 
        totalPages: 1 
      },
      links: {
        firstPage: 'http://localhost:3000/capsules?page=1&limit=10',
        lastPage: 'http://localhost:3000/capsules?page=1&limit=10',
        currentPage: 'http://localhost:3000/capsules?page=1&limit=10',
        previousPage: null,
        nextPage: null,
      },
    });

    const result = await service.findAllCapsules(paginationDto, months);
    
    expect(paginationService.paginationQuery).toHaveBeenCalledWith(
      paginationDto,
      capsuleRepository
    );
    expect(result.data).toEqual(mockCapsules);
    expect(result.meta.totalItemsPerPage).toEqual(1); // ✅ Updated expectation
  });

  it('should throw BadRequestException if months is not a positive integer', async () => {
    const paginationDto: PaginationQueryDto = { page: 1, limit: 10 };

    await expect(service.findAllCapsules(paginationDto, -5)).rejects.toThrow(
      new BadRequestException('Months must be a positive integer.')
    );

    await expect(service.findAllCapsules(paginationDto, 0)).rejects.toThrow(
      new BadRequestException('Months must be a positive integer.')
    );

    await expect(service.findAllCapsules(paginationDto, NaN)).rejects.toThrow(
      new BadRequestException('Months must be a positive integer.')
    );
  });
});
