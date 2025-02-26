import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get('capsules')
  async getCapsules(
    @Query('isUnlocked') isUnlocked?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    // Convert the isUnlocked query parameter to a boolean or undefined
    const unlockStatus =
      isUnlocked === 'true' ? true : isUnlocked === 'false' ? false : undefined;

    if (
      isUnlocked !== undefined &&
      isUnlocked !== 'true' &&
      isUnlocked !== 'false'
    ) {
      throw new BadRequestException('isUnlocked must be true or false');
    }

    return this.adminService.findCapsulesByUnlockStatus(
      unlockStatus,
      page,
      limit,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
