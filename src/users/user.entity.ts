export type UserType = 'guest' | 'user' | 'admin';

export class User {
  id: string;
  email?: string;
  password?: string;
  type: UserType;
}
