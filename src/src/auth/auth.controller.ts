import { Controller, Post, Body, Get } from "@nestjs/common"
import type { AuthService } from "./auth.service"
import type { LoginDto } from "./dto/login.dto"
import type { RegisterDto } from "./dto/register.dto"
import { CurrentUser } from "./decorators/current-user.decorator"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("guest")
  createGuestUser() {
    return this.authService.createGuestUser()
  }

  @Get('profile')
  getProfile(@CurrentUser() user) {
    return user;
  }
}
