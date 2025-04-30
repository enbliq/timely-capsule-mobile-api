import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret', // replace with env variable ideally
    });
  }

  async validate(payload: any) {
    const user = this.usersService.findById(payload.sub);
    if (!user) throw new Error('User not found');

    return {
      ...user,
      isGuest: payload.guest === true,
    };
  }
}
