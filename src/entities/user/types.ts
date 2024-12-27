export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string | null;
}

export type UserResponse = Omit<User, 'password'>;
export type CreateUser = Pick<User, 'name' | 'email' | 'password'>
