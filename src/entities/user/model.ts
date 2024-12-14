import { User, UserResponse } from './types';

export class UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string | null;

  constructor({
    id = crypto.randomUUID(),
    name,
    email,
    password,
    createdAt = new Date().toISOString(),
    updatedAt = null,
  }: Partial<User> & Pick<User, 'name' | 'email' | 'password'>) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toResponse(): UserResponse {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toCreation(): Pick<User, 'name' | 'email' | 'password'> {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
    };
  }
}
