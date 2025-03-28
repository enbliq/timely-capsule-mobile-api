import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapsuleHistoryService } from './capsule-history.service';
import { CapsuleHistoryController } from './capsule-history.controller';
import { CapsuleHistory } from './entities/capsule-history.entity';
import { UserModule } from 'src/user/user.module';
import { CapsuleModule } from 'src/capsule/capsule.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CapsuleHistory]),
    UserModule,
    CapsuleModule,
  ],
  controllers: [CapsuleHistoryController],
  providers: [CapsuleHistoryService],
  exports: [CapsuleHistoryService],
})
