import { User } from './types';
import bcrypt from 'bcrypt';
import UserRepository from '@infrastructure/repositories/user';
import { UserModel } from '@entities/user/model';
import { UserNotFoundError } from '@entities/user/errors';

class UserService {
    private readonly bcryptSaltRounds = 10;
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
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
}

export default UserService;
