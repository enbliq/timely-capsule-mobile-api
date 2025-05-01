import { Controller, Post, Body, Get } from "@nestjs/common"
import type { AuthService } from "./auth.service"
import type { LoginDto } from "./dto/login.dto"
import type { RegisterDto } from "./dto/register.dto"
import type { UpgradeGuestDto } from "./dto/upgrade-guest.dto"
import { CurrentUser } from "./decorators/current-user.decorator"
import { Public } from "./decorators/public.decorator"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post("guest")
  async createGuestUser() {
    return this.authService.createGuestUser()
  }

  @Post("upgrade-guest")
  async upgradeGuest(@CurrentUser() user, @Body() upgradeGuestDto: UpgradeGuestDto) {
    return this.authService.upgradeGuestToUser(user.userId, upgradeGuestDto)
  }

  @Get('profile')
  async getProfile(@CurrentUser() user) {
    return user;
  }

  @Get('is-guest')
  async isGuest(@CurrentUser() user) {
    const isGuest = await this.authService.isGuest(user.userId)
    return { isGuest }
  }
}
