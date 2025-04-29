import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  createGuest(): User {
    const guest = { id: crypto.randomUUID(), type: 'guest' };
    this.users.push(guest);
    return guest;
  }

  findById(id: string): User {
    return this.users.find((u) => u.id === id);
  }

  async upgradeGuestToUser(
    id: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user = this.findById(id);
    if (!user || user.type !== 'guest') throw new Error('Invalid guest');
    user.email = email;
    user.password = await bcrypt.hash(password, 10);
    user.type = 'user';
    return user;
  }
}
