import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import type { UsersService } from './users.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NoGuestsGuard } from '../auth/guards/no-guests.guard';
import { GuestAllowed } from '../auth/decorators/guest-allowed.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(NoGuestsGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(NoGuestsGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @GuestAllowed()
  findMe(@CurrentUser() user) {
    return this.usersService.findOne(user.userId);
  }

  @Get(':id')
  @UseGuards(NoGuestsGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(NoGuestsGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(NoGuestsGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
