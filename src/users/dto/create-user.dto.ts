import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import type { CollaboratorRole, UserRole } from '../../models/user.schema';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsEnum(['user', 'admin'])
  @IsOptional()
  role?: UserRole;

  @IsEnum(['viewer', 'editor', 'co-owner'])
  @IsOptional()
  collaboratorRole?: CollaboratorRole;
}
