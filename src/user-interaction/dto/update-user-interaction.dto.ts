import { PartialType } from '@nestjs/swagger';
import { CreateUserInteractionDto } from './create-user-interaction.dto';

export class UpdateUserInteractionDto extends PartialType(CreateUserInteractionDto) {}
