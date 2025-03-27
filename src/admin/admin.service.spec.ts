/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { Repository } from 'typeorm';
import { Capsule } from 'src/capsule/entities/capsule.entity';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

describe('AdminService', () => {
  let adminService: AdminService;
  let capsuleRepository: Repository<Capsule>;
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Capsule),
          useClass: Repository,
        },
        {
          provide: PaginationService,
          useValue: {
            paginationQuery: jest.fn().mockResolvedValue({
              data: [],
              meta: {},
              links: {},
            }),
          },
        },
      ],
    }).compile();

    adminService = module.get<AdminService>(AdminService);
    capsuleRepository = module.get<Repository<Capsule>>(
      getRepositoryToken(Capsule),
    );
    paginationService = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(adminService).toBeDefined();
  });

  describe('findCapsulesByUnlockStatus', () => {
    it('should throw BadRequestException if isUnlocked is invalid', async () => {
      await expect(
        adminService.findCapsulesByUnlockStatus('invalid' as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should filter unlocked capsules and return paginated results', async () => {
      const capsules: Capsule[] = [
        { id: 1, unlockAt: new Date(Date.now() - 1000) } as Capsule,
        { id: 2, unlockAt: new Date(Date.now() + 10000) } as Capsule,
      ];

      jest.spyOn(capsuleRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([capsules[0]]),
      } as any);

      jest.spyOn(paginationService, 'paginationQuery').mockResolvedValue({
        data: [capsules[0]],
        meta: {
          itemsPerPage: 1,
          totalItemsPerPage: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          firstPage: 'http://example.com?page=1',
          lastPage: 'http://example.com?page=1',
          currentPage: 'http://example.com?page=1',
          previousPage: null,
          nextPage: null,
        },
      });

      const result = await adminService.findCapsulesByUnlockStatus(true, 1, 1);
      expect(result.data.length).toBe(1);
      expect(result.data[0].id).toBe(1);
      expect(result.meta.itemsPerPage).toBe(1);
      expect(result.links.firstPage).toBe('http://example.com?page=1');
    });
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
