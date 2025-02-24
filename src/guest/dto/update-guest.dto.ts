import { PartialType } from '@nestjs/mapped-types';
import { CreateGuestCapsuleAccessLogDto } from './create-guest.dto';

export class UpdateGuestDto extends PartialType(
  CreateGuestCapsuleAccessLogDto,
) {}
