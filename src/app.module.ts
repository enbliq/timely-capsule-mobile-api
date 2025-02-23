import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CapsuleModule } from './capsule/capsule.module';
import { GuestModule } from './guest/guest.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [UserModule, AuthModule, CapsuleModule, GuestModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
