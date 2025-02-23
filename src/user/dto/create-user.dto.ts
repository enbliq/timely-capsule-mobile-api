import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Column } from 'typeorm';
import { Exclude } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(90)
  firstname: string;

  @IsString()
  @IsOptional()
  @MaxLength(90)
  lastname: string;

  @IsEmail()
  @MaxLength(150)
  @Column({ unique: true, length: 150 })
  email: string;

  @Exclude()
  @IsString()
  @MaxLength(225)
  @Matches(
    /^(?=.*[!@#$%^&])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
    {
      message:
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}