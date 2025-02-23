import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SignInService } from './sign-in.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SignInService],
  exports: [SignInService]
})
export class AuthModule {}
