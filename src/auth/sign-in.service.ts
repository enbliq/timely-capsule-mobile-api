import { Injectable, UnauthorizedException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { UserService } from "../user/user.service"
import type { HashingProvider } from "./provider/hashing.provider"
import type { SignInDto } from "./dto/sign-in.dto"

@Injectable()
export class SignInService {
  constructor(
    private userService: UserService,
    private hashProvider: HashingProvider,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { email, password } = signInDto

    try {
      const user = await this.userService.findOneByEmail(email)

      const isPasswordValid = await this.hashProvider.comparePassword(password, user.passwordHash)

      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials")
      }

      const payload = { sub: user.id, email: user.email }
      const access_token = this.jwtService.sign(payload)

      return { access_token }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }
      throw new UnauthorizedException("Invalid credentials")
    }
  }
}

