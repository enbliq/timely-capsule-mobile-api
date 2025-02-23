import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { HashingProvider } from './providers/hashing';
import { BcryptProvider } from './providers/bcrypt';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider, // Use the abstract class as a token
      useClass: BcryptProvider, // Bind it to the concrete implementation
    },
  ],
  exports: [HashingProvider],
})
export class AuthModule {}
