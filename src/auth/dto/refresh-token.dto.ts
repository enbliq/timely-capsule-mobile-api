import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ 
    description: 'Refresh token for authentication', type: String 
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
