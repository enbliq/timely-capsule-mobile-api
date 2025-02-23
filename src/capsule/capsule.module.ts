import { Module } from '@nestjs/common';
import { CapsuleService } from './capsule.service';
import { CapsuleController } from './capsule.controller';

@Module({
  controllers: [CapsuleController],
  providers: [CapsuleService],
})
export class CapsuleModule {}
