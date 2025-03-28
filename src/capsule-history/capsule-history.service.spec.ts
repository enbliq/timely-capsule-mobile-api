import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CapsuleHistoryService } from './capsule-history.service';
import { CapsuleHistory, CapsuleActionType } from './entities/capsule-history.entity';
import { UserService } from '../user/user.service';
import { CapsuleService } from '../capsule/capsule.service';
import { NotFoundException } from '@nestjs/common';

describe('CapsuleHistoryService', () => {
  let service: CapsuleHistoryService;
  let historyRepository: Repository<CapsuleHistory>;
  let userService: UserService;
  let capsuleService: CapsuleService;

  const mockHistoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockCapsuleService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CapsuleHistoryService,
        {
          provide: getRepositoryToken(CapsuleHistory),
          useValue: mockHistoryRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: CapsuleService,
          useValue: mockCapsuleService,
        },
      ],
    }).compile();

    service = module.get<CapsuleHistoryService>(CapsuleHistoryService);
    historyRepository = module.get<Repository<CapsuleHistory>>(
      getRepositoryToken(CapsuleHistory),
    );
    userService = module.get<UserService>(UserService);
    capsuleService = module.get<CapsuleService>(CapsuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockDto = {
      actionType: CapsuleActionType.CREATED,
      capsuleId: 'test-capsule-id',
      changes: { title: 'New Title' },
      notes: 'Test notes',
    };

    const mockActor = { id: 'test-user-id', username: 'testuser' };
    const mockCapsule = { id: 'test-capsule-id', title: 'Test Capsule' };

    it('should create a history entry successfully', async () => {
      mockCapsuleService.findOne.mockResolvedValue(mockCapsule);
      mockHistoryRepository.create.mockReturnValue({ ...mockDto, actor: mockActor, capsule: mockCapsule });
      mockHistoryRepository.save.mockResolvedValue({ id: 'test-history-id', ...mockDto, actor: mockActor, capsule: mockCapsule });

      const result = await service.create(mockDto, mockActor as any);

      expect(result).toBeDefined();
      expect(result.id).toBe('test-history-id');
      expect(mockCapsuleService.findOne).toHaveBeenCalledWith(mockDto.capsuleId);
      expect(mockHistoryRepository.create).toHaveBeenCalled();
      expect(mockHistoryRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when capsule is not found', async () => {
      mockCapsuleService.findOne.mockResolvedValue(null);

      await expect(service.create(mockDto, mockActor as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCapsuleId', () => {
    const mockCapsuleId = 'test-capsule-id';
    const mockHistory = [
      { id: 'history-1', actionType: CapsuleActionType.CREATED },
      { id: 'history-2', actionType: CapsuleActionType.EDITED },
    ];

    it('should return history entries for a capsule', async () => {
      mockHistoryRepository.find.mockResolvedValue(mockHistory);

      const result = await service.findByCapsuleId(mockCapsuleId);

      expect(result).toEqual(mockHistory);
      expect(mockHistoryRepository.find).toHaveBeenCalledWith({
        where: { capsule: { id: mockCapsuleId } },
        relations: ['actor', 'previousOwner', 'newOwner'],
        order: { timestamp: 'DESC' },
      });
    });

    it('should throw NotFoundException when no history is found', async () => {
      mockHistoryRepository.find.mockResolvedValue([]);

      await expect(service.findByCapsuleId(mockCapsuleId)).rejects.toThrow(NotFoundException);
    });
  });
});
