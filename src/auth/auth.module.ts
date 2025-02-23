// src/auth/auth.module.ts
import { Module,forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import jwtConfig from './config/jwt.config';
import { GenerateTokensProvider } from './provider/generate-token.provider';
import { UserModule } from 'src/user/user.module';
import { HashProvider } from 'src/app.service';


@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig), // Loads JWT configuration
    JwtModule.register({}),
    forwardRef(() => UserModule)
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, GenerateTokensProvider, HashProvider],
})


export class AuthModule {}


