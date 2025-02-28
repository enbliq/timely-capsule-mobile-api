import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CapsuleService } from './capsule.service';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { UpdateCapsuleDto } from './dto/update-capsule.dto';
import { NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('capsule')
@Controller('capsule')
export class CapsuleController {
  constructor(private readonly capsuleService: CapsuleService) {}

  @ApiOperation({ summary: 'Create a new capsule' })
  @ApiResponse({ status: 201, description: 'Capsule created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createCapsuleDto: CreateCapsuleDto) {
    return this.capsuleService.create(createCapsuleDto);
  }

  @ApiOperation({ summary: 'Get all capsules' })
  @ApiResponse({ status: 200, description: 'List of capsules retrieved' })
  @Get()
  findAll() {
    return this.capsuleService.findAll();
  }

  @ApiOperation({ summary: 'Get a capsule by ID' })
  @ApiResponse({ status: 200, description: 'Capsule retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Capsule not found' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const capsule = await this.capsuleService.findOneById(id);
    if (!capsule) {
      throw new NotFoundException('Capsule not found');
    }
    return capsule;
  }

  @ApiOperation({ summary: 'Update a capsule by ID' })
  @ApiResponse({ status: 200, description: 'Capsule updated successfully' })
  @ApiResponse({ status: 404, description: 'Capsule not found' })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCapsuleDto: CreateCapsuleDto) {
    return this.capsuleService.update(id, updateCapsuleDto);
  }

  @ApiOperation({ summary: 'Delete a capsule by ID' })
  @ApiResponse({ status: 200, description: 'Capsule deleted successfully' })
  @ApiResponse({ status: 404, description: 'Capsule not found' })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.capsuleService.deleteCapsule(id);
  }
}
