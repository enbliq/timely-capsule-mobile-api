import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsDate } from 'class-validator';

export class GuestCapsuleAccessLogDto {
  @ApiProperty({
    type: 'string',
    example: 'guest_123',
    description: 'Unique identifier for the guest',
  })
  @IsString()
  guestIdentifier: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2024-01-01T12:00:00Z',
    description: 'Timestamp of access',
  })
  @IsDate()
  accessTime: Date;

  @ApiProperty({
    type: 'string',
    example: 'entry',
    description: 'Action performed by the guest',
  })
  @IsString()
  action: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the capsule',
  })
  @IsUUID()
  capsuleId: string;
}
