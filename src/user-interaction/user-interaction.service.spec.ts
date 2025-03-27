import { Test, TestingModule } from '@nestjs/testing';
import { UserInteractionService } from './user-interaction.service';

describe('UserInteractionService', () => {
  let service: UserInteractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInteractionService],
    }).compile();

    service = module.get<UserInteractionService>(UserInteractionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
