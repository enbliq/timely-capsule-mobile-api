import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AccessLogModule } from './modules/access-log/access-log.module';
import { CapsulesModule } from './modules/capsules/capsules.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [UsersModule, AccessLogModule, CapsulesModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
