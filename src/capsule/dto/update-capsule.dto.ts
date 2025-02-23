import { PartialType } from '@nestjs/mapped-types';
import { CreateCapsuleDto } from './create-capsule.dto';

export class UpdateCapsuleDto extends PartialType(CreateCapsuleDto) {}
