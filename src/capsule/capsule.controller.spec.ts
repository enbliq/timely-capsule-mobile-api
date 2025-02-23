import { Test, TestingModule } from '@nestjs/testing';
import { CapsuleController } from './capsule.controller';
import { CapsuleService } from './capsule.service';

describe('CapsuleController', () => {
  let controller: CapsuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CapsuleController],
      providers: [CapsuleService],
    }).compile();

    controller = module.get<CapsuleController>(CapsuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
