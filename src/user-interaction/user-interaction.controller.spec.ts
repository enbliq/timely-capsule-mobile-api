import { Test, TestingModule } from '@nestjs/testing';
import { UserInteractionController } from './user-interaction.controller';
import { UserInteractionService } from './user-interaction.service';

describe('UserInteractionController', () => {
  let controller: UserInteractionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserInteractionController],
      providers: [UserInteractionService],
    }).compile();

    controller = module.get<UserInteractionController>(UserInteractionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
