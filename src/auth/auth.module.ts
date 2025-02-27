// src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import jwtConfig from './config/jwt.config';
import { GenerateTokensProvider } from './provider/generate-token.provider';
import { BcryptProvider } from './provider/bcrpt.provider';
import { HashingProvider } from './provider/hashing.provider';
import { UserModule } from 'src/user/user.module';
// import { RefreshTokenProvider } from './provider/refreshToken.provider';
import { SignInService } from './sign-in.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ConfigModule.forFeature(jwtConfig), // Loads JWT configuration
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SignInService,
    GenerateTokensProvider,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    // RefreshTokenProvider,
    SignInService,
  ],
  exports: [AuthService, SignInService, HashingProvider],
})
export class AuthModule {}
