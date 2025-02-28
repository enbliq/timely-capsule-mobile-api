import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class FollowDto {
  @ApiProperty({
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the user being followed',
  })
  @IsNotEmpty()
  @IsUUID()
  followingId: string;
}

export class FollowResponseDto {
  @ApiProperty({
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'UUID of the follow relationship',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'UUID of the follower',
  })
  followerId: string;

  @ApiProperty({
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440003',
    description: 'UUID of the user being followed',
  })
  followingId: string;

  @ApiProperty({
    type: 'string',
    example: '2024-02-27T12:00:00Z',
    description: 'Timestamp when the follow action was created',
  })
  createdAt: Date;
}

export class UserDto {
  @ApiProperty({
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440004',
    description: 'UUID of the user',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: 'john_doe',
    description: 'Username of the user',
  })
  username: string;

  @ApiProperty({
    type: 'string',
    example: 'Software developer and tech enthusiast',
    description: 'Short biography of the user',
    required: false,
  })
  bio?: string;

  @ApiProperty({
    type: 'string',
    example: 'https://example.com/profile.jpg',
    description: 'Profile picture URL of the user',
    required: false,
  })
  profilePicture?: string;

  @ApiProperty({
    type: 'boolean',
    example: true,
    description: 'Indicates if the authenticated user follows this user',
    required: false,
  })
  isFollowing?: boolean;

  @ApiProperty({
    type: 'number',
    example: 100,
    description: 'Total count of followers',
    required: false,
  })
  followersCount?: number;

  @ApiProperty({
    type: 'number',
    example: 50,
    description: 'Total count of users this user follows',
    required: false,
  })
  followingCount?: number;
}

export class ActivityDto {
  @ApiProperty({
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440005',
    description: 'UUID of the activity',
  })
  id: string;

  @ApiProperty({
    type: UserDto,
    description: 'User associated with the activity',
  })
  user: UserDto;

  @ApiProperty({
    type: 'string',
    example: 'follow',
    description: 'Type of activity (e.g., follow, like, comment)',
  })
  type: string;

  @ApiProperty({
    type: 'object',
    description: 'Additional data related to the activity',
    additionalProperties: true,
  })
  data: any;

  @ApiProperty({
    type: 'string',
    example: '2024-02-27T12:00:00Z',
    description: 'Timestamp when the activity was created',
  })
  createdAt: Date;
}

export class PaginationDto {
  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'Page number, must be at least 1',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    type: 'number',
    example: 20,
    description: 'Number of items per page, must be at least 1',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
