import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCapsuleDto {
  @IsUUID()
  @IsNotEmpty()
  ownerId: string; // User ID who owns the capsule

  @IsString()
  @IsNotEmpty()
  capsuleName: string;
}
