import { Module } from '@nestjs/common';
import { PublicCapsulesService } from './providers/public-capsules.service.ts/public-capsules.service.ts.service';

@Module({
  providers: [PublicCapsulesService]
})
export class PublicCapsuleModule {}
