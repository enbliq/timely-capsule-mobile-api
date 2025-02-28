/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { GuestService } from './providers/guest.service';
import { GuestGuard } from './providers/guest.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('guest')
@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post('login')
  async guestLogin() {
    const guestId = await this.guestService.createGuestSession();
    return { guestId, message: 'Guest session created. Expires in 10 minutes.' };
  }
  @Delete('logout')
  async guestLogout(@Body() body: { guestId: string }) {
    await this.guestService.deleteGuestSession(body.guestId);
    return { message: 'Guest session deleted.' };
  }
  @Get('validate')
  @UseGuards(GuestGuard)
  async validateGuestSession(@Body() body: { guestId: string }) {
    const isValid = await this.guestService.isGuestSessionValid(body.guestId);
    return { isValid };
  }

}
