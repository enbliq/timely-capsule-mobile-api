import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokenService } from './token.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}), // JWT will be configured dynamically
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
