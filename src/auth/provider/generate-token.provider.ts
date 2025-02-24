import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService, //dependency injection of jwtService

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>, //dependency injection of jwtConfigurations
  ) {}

  public async SignToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn,
      },
    );
  }

  public async generateToken(user: User) {
    const [access_token, refresh_token] = await Promise.all([
      // generate access token
      this.SignToken(user.id, this.jwtConfiguration.ttl, {
        email: user.email,
      }),
      // generate refresh token
      this.SignToken(user.id, this.jwtConfiguration.Rttl),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }
}
