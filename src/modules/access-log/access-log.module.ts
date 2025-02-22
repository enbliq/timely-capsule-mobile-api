import { Module } from '@nestjs/common';
import { AccessLogController } from './access-log.controller';
import { AccessLogService } from './access-log.service';

@Module({
  controllers: [AccessLogController],
  providers: [AccessLogService]
})
export class AccessLogModule {}
