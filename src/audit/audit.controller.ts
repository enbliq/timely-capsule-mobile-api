import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { AuditService } from './audit.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('audit')
@UseGuards(RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.auditService.findAll();
  }

  @Get('user')
  @Roles('admin')
  findByUser(@Query('userId') userId: string) {
    return this.auditService.findByUser(userId);
  }

  @Get('resource')
  @Roles('admin')
  findByResource(@Query('resource') resource: string) {
    return this.auditService.findByResource(resource);
  }

  @Get('action')
  @Roles('admin')
  findByAction(@Query('action') action: string) {
    return this.auditService.findByAction(action);
  }
}
