import { User } from './types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '@app/config';
import UserRepository from '@infrastructure/repositories/user';
import dbPool from '@infrastructure/database/connection';
import { UserModel } from '@entities/user/model';
import { UserNotFoundError } from '@entities/user/errors';

class UserService {
    private readonly bcryptSaltRounds = 10;
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository(dbPool);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.getByEmail(email);
    }

    async createUser(name: string, email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, this.bcryptSaltRounds);
        const user = new UserModel({ name, email, password: hashedPassword });

        return this.userRepository.create(user.toCreation());
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userRepository.getById(id);
    }

    async updateUser(id: string, name: string, email: string) {
        const user = await this.getUserById(id);

        if (!user) {
            throw new UserNotFoundError();
        }

        const userModel = new UserModel(user);
        userModel.patch({ name, email, updatedAt: new Date().toISOString() });

        return this.userRepository.update(userModel.toPlain());
    }

    static async comparePasswords(inputPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(inputPassword, hashedPassword);
    }

    static verifyToken(token: string) {
        return jwt.verify(token, config.auth.jwtSecret) as { id: string };
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
