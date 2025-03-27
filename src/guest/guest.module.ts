import { Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestCapsuleAccessLog } from './entities/guest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GuestCapsuleAccessLog])],
  controllers: [GuestController],
  providers: [GuestService],
  exports:[GuestService]
})
export class GuestModule {}
