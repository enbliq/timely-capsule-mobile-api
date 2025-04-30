import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  createGuestToken(): string {
    const guest = this.usersService.createGuest();
    return this.jwtService.sign({ sub: guest.id, guest: true });
  }

  async loginAsUser(email: string, password: string) {
    // You’d normally find the user and validate password
    const user = this.usersService.findByEmail(email);
    return this.jwtService.sign({ sub: user.id, role: 'user' });
  }

  async upgradeGuestToUser(sub: string, email: string, password: string) {
    return this.usersService.upgradeGuestToUser(sub, email, password);
  }
}
