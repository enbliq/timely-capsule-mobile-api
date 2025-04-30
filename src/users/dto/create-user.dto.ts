import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import type { AuthProvider } from '../schemas/user.schema';

export class CreateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsOptional()
  roles?: string[];

  @IsOptional()
  guest?: boolean;

  @IsOptional()
  provider?: AuthProvider;
}
