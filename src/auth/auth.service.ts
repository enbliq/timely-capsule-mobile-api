import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import type { UsersService } from "../users/users.service"
import type { LoginDto } from "./dto/login.dto"
import type { RegisterDto } from "./dto/register.dto"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)

    if (!user || !user.passwordHash) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (isPasswordValid) {
      // Update last login time
      await this.usersService.updateLastLogin(user._id)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user.toObject()
      return result
    }

    return null
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)

    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const payload = {
      sub: user._id,
      email: user.email,
      roles: user.roles,
      isVerified: user.isVerified,
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        roles: user.roles,
        isVerified: user.isVerified,
        provider: user.provider,
      },
    }
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email)

    if (existingUser) {
      throw new BadRequestException("User with this email already exists")
    }

    // Create new user
    const newUser = await this.usersService.create({
      email: registerDto.email,
      password: registerDto.password,
      displayName: registerDto.displayName,
      provider: "local",
      roles: ["user"],
      guest: false,
    })

    // Generate JWT token
    const payload = {
      sub: newUser._id,
      email: newUser.email,
      roles: newUser.roles,
      isVerified: newUser.isVerified,
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: newUser._id,
        email: newUser.email,
        displayName: newUser.displayName,
        roles: newUser.roles,
        isVerified: newUser.isVerified,
        provider: newUser.provider,
      },
    }
  }

  async createGuestUser() {
    const guestUser = await this.usersService.create({
      displayName: `Guest_${Date.now()}`,
      guest: true,
      roles: ["guest"],
    })

    const payload = {
      sub: guestUser._id,
      roles: guestUser.roles,
      guest: true,
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: guestUser._id,
        displayName: guestUser.displayName,
        roles: guestUser.roles,
        guest: guestUser.guest,
      },
    }
  }
}
