import { Test, TestingModule } from '@nestjs/testing';
import { PublicCapsulesService } from './public-capsules.service.ts.service';

describe('PublicCapsulesServiceTsService', () => {
  let service: PublicCapsulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicCapsulesService],
    }).compile();

    service = module.get<PublicCapsulesService>(PublicCapsulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
