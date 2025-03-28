import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CapsuleHistoryService } from './capsule-history.service';
import { CreateCapsuleHistoryDto } from './dto/create-capsule-history.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('capsule-history')
@Controller('capsule-history')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CapsuleHistoryController {
  constructor(private readonly capsuleHistoryService: CapsuleHistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new capsule history entry' })
  @ApiResponse({ status: 201, description: 'History entry created successfully' })
  @ApiResponse({ status: 404, description: 'Capsule or User not found' })
  create(@Body() dto: CreateCapsuleHistoryDto, @GetUser() actor: User) {
    return this.capsuleHistoryService.create(dto, actor);
  }

  @Get('capsule/:id')
  @ApiOperation({ summary: 'Get complete history for a capsule' })
  @ApiResponse({ status: 200, description: 'Returns the capsule history timeline' })
  @ApiResponse({ status: 404, description: 'No history found for the capsule' })
  findByCapsuleId(@Param('id', ParseUUIDPipe) id: string) {
    return this.capsuleHistoryService.findByCapsuleId(id);
  }
}
