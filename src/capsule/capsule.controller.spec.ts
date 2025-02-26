/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';

import { CapsuleService } from './capsule.service';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { CapsuleController } from './capsule.controller';


describe('CapsuleController', () => {
  let controller: CapsuleController;
  let service: CapsuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CapsuleController],
      providers: [
        {
          provide: CapsuleService,
          useValue: {
            create: jest.fn().mockImplementation((dto: CreateCapsuleDto) => ({
              id: 'uuid',
              title: dto.title,
              content: dto.content,
              password: undefined, // Ensure password is excluded
            })),
          },
        },
      ],
    }).compile();

    controller = module.get<CapsuleController>(CapsuleController);
    service = module.get<CapsuleService>(CapsuleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should exclude password from the response', async () => {
    const createCapsuleDto: CreateCapsuleDto = {
      title: 'My Capsule',
      content: 'Some content',
      password: 'securePassword',
    };

    const result = await controller.createCapsule(createCapsuleDto);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('content');
    expect(result).not.toHaveProperty('password'); // Password should be excluded
  });
});
