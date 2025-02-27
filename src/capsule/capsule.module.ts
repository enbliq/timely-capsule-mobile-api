import { Module } from '@nestjs/common';
import { CapsuleService } from './capsule.service';
import { CapsuleController } from './capsule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Capsule } from './entities/capsule.entity';
import { FindOneById } from './providers/findone';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Capsule]),UserModule,AuthModule],
  exports: [CapsuleService],
  controllers: [CapsuleController],
  providers: [CapsuleService,FindOneById],
})
export class CapsuleModule {}
