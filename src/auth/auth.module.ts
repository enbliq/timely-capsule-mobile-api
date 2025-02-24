// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import jwtConfig from './config/jwt.config';
import { GenerateTokensProvider } from './provider/generate-token.provider';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig), // Loads JWT configuration
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, GenerateTokensProvider],
})


export class AuthModule {}
