import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    type: 'string',
    example: 'John',
    description: 'First name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    type: 'string',
    example: 'Doe',
    description: 'Last name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    type: 'string',
    example: 'johndoe@mail.com',
    description: 'Updated email of the user',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: 'string',
    example: 'NewPassword123',
    description: 'Updated password with at least 8 characters',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}