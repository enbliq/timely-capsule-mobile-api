import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { HashProvider } from 'src/app.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, HashProvider]
})
export class AuthModule {}
