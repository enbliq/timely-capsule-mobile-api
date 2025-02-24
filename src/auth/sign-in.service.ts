import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashingProvider } from './provider/hashing.provider';
import type { SignInDto } from './dto/sign-in.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SignInService {
  constructor(
    // private userService: UserService,
    // private hashProvider: HashingProvider,
    // private jwtService: JwtService,

    @Inject(HashingProvider) private hashProvider: HashingProvider,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(UserService) private userService: UserService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { email, password } = signInDto;

    try {
      const user = await this.userService.findOneByEmail(email);

      const isPasswordValid = await this.hashProvider.comparePassword(
        password,
        user.passwordHash,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user.id, email: user.email };
      const access_token = this.jwtService.sign(payload);

      return { access_token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
