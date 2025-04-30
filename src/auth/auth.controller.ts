import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('guest-token')
  getGuestToken() {
    const token = this.authService.createGuestToken();
    return { token };
  }

  @Post('upgrade')
  @UseGuards(AuthGuard('jwt'))
  async upgrade(@Req() req, @Body() body) {
    const { email, password } = body;
    const user = await this.authService.upgradeGuestToUser(
      req.user.sub,
      email,
      password,
    );
    return { message: 'Upgraded', user };
  }
}
