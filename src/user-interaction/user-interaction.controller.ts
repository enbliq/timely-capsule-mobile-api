import { Controller, Post, Body, Get, Param, UseGuards, Logger } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';
import { CreateUserInteractionDto } from './dto/create-user-interaction.dto';
import { UserInteraction } from './entities/user-interaction.entity';

@Controller('user-interactions')
export class UserInteractionController {
  private readonly logger = new Logger(UserInteractionController.name);

  constructor(private readonly userInteractionService: UserInteractionService) {}

  @Post()
  @UseGuards()
  async create(@Body() createUserInteractionDto: CreateUserInteractionDto): Promise<UserInteraction> {
    this.logger.log(`Recording user interaction: ${JSON.stringify(createUserInteractionDto)}`);
    return this.userInteractionService.create(createUserInteractionDto);
  }

  @Get('user/:userId')
  @UseGuards()
  async findByUser(@Param('userId') userId: number): Promise<UserInteraction[]> {
    return this.userInteractionService.findByUser(userId);
  }

  @Get('capsule/:capsuleId')
  async findByCapsule(@Param('capsuleId') capsuleId: number): Promise<UserInteraction[]> {
    return this.userInteractionService.findByCapsule(capsuleId);
  }

  @Get('recent')
  async getRecentInteractions(): Promise<UserInteraction[]> {
    return this.userInteractionService.getRecentInteractions();
  }
}