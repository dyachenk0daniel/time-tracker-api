import { User } from './types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '@app/config';
import UserRepository from '@infrastructure/repositories/user';
import dbPool from '@infrastructure/database/connection';
import { UserModel } from '@entities/user/model';

class UserService {
  private readonly bcryptSaltRounds = 10;
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(dbPool);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.getByEmail(email);
  }

  async createUser(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, this.bcryptSaltRounds);
    const user = new UserModel({ name, email, password: hashedPassword });

    return this.userRepository.create(user.toCreation());
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  static async comparePasswords(inputPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  static validateToken(token: string) {
    return jwt.verify(token, config.auth.jwtSecret) as { id: number };
  }

  static generateToken<T extends Pick<User, 'id' | 'name'>>(user: T) {
    return jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpiresIn }
    );
  }
}

export default UserService;
