import { IsString, IsUUID, IsDate, IsNotEmpty } from 'class-validator';

export class CreateGuestCapsuleAccessLogDto {
  @IsUUID()
  @IsNotEmpty()
  guestId: string;

  @IsUUID()
  @IsNotEmpty()
  capsuleId: string;

  @IsDate()
  accessTime: Date;

  @IsString()
  @IsNotEmpty()
  accessType: 'ENTER' | 'EXIT'; // Enum-like behavior (optional)
}
