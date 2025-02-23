import { Injectable, UnauthorizedException } from "@nestjs/common"
import type { UserService } from "../user/user.service"
import type { SignInDto } from "./dto/sign-In.dto"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class SignInService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    //Waiting for HashingProvider to be implemented

  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { email, password } = signInDto

    try {
      const user = await this.userService.findOneByEmail(email)

      // Waiting for HashingProvider to be implemented

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

