import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestCapsuleAccessLogDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post()
  create(@Body() createGuestDto: GuestCapsuleAccessLogDto) {
    return this.guestService.create(createGuestDto);
  }

  @Get()
  public getGuests(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.guestService.findAll(limit, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestService.update(+id, updateGuestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guestService.remove(+id);
  }
}
