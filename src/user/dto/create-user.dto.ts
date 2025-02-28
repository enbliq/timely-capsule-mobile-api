import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    example: 'John Peter',
    description: 'name field',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'johnpeter@mail.com',
    description: 'Email field',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    example: '@Password123',
    description: 'Password should contain numbers, alphabets, and uppercase',
  })
  @IsString()
  password: string;

  @ApiProperty({
    type: 'string',
    example: 'https://example.com/profile.jpg',
    description: 'Profile picture URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({
    type: 'boolean',
    example: false,
    description: 'Indicates if the user is a guest',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isGuest?: boolean;

  @ApiProperty({
    type: 'string',
    example: 'premium',
    description: 'Subscription tier of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  subscriptionTier?: string;

  @ApiProperty({
    type: 'string',
    example: '0x123456789abcdef',
    description: 'Wallet address of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  walletAddress?: string;
}
