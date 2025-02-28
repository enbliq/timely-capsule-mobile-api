import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query-dto.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @ApiOperation({ summary: 'Get capsules based on unlock status' })
  @ApiQuery({ name: 'isUnlocked', required: false, type: 'string', enum: ['true', 'false'], description: 'Filter by unlock status' })
  @ApiQuery({ name: 'page', required: false, type: 'number', description: 'Pagination page number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Capsules retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query parameter for isUnlocked' })
  @Get('capsules')
  async getCapsules(
    @Query('isUnlocked') isUnlocked?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
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

  @ApiOperation({ summary: 'Retrieve all capsules with optional pagination and filtering' })
  @ApiQuery({ name: 'months', required: false, type: 'number', description: 'Filter capsules by months' })
  @ApiResponse({ status: 200, description: 'Capsules retrieved successfully' })
  @Get()
  async findAllCapsules(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Query('months') months?: number
  ) {
    return this.adminService.findAllCapsules(paginationQueryDto, months);
  }

  @ApiOperation({ summary: 'Retrieve a specific admin by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Admin ID' })
  @ApiResponse({ status: 200, description: 'Admin retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update an existing admin' })
  @ApiParam({ name: 'id', type: 'string', description: 'Admin ID' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @ApiOperation({ summary: 'Delete an admin' })
  @ApiParam({ name: 'id', type: 'string', description: 'Admin ID' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
