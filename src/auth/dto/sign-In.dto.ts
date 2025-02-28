import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'User email address',
    type: String,
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    type: String,
    minLength: 8,
    example: 'securePass123',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
