import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CapsuleService } from './capsule.service';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { UpdateCapsuleDto } from './dto/update-capsule.dto';

@Controller('capsule')
export class CapsuleController {
  constructor(private readonly capsuleService: CapsuleService) {}

  @Post()
  create(@Body() createCapsuleDto: CreateCapsuleDto) {
    return this.capsuleService.create(createCapsuleDto);
  }

  @Get()
  findAll() {
    return this.capsuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.capsuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCapsuleDto: UpdateCapsuleDto) {
    return this.capsuleService.update(+id, updateCapsuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.capsuleService.remove(+id);
  }
}
