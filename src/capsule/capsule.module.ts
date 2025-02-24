import { Module } from '@nestjs/common';
import { CapsuleService } from './capsule.service';
import { CapsuleController } from './capsule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Capsule } from './entities/capsule.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Capsule]), UserModule],
  exports: [CapsuleService],
  controllers: [CapsuleController],
  providers: [CapsuleService],
})
export class CapsuleModule {}
