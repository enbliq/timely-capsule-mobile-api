import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { InteractionType } from '../entities/user-interaction.entity';

export class CreateUserInteractionDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  capsuleId: number;

  @IsNotEmpty()
  @IsEnum(InteractionType)
  interactionType: InteractionType;
}