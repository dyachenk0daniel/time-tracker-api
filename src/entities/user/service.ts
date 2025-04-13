import { User } from './types';
import bcrypt from 'bcrypt';
import { HttpException } from '@interfaces/response-models';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import { PrismaClient } from '@prisma/client';
import { DateUtils } from '@shared/utils';

class UserService {
    private readonly bcryptSaltRounds = 10;
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        return user ? DateUtils.convertDatesToISOStrings(user) : null;
    }

    async createUser(name: string, email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, this.bcryptSaltRounds);
        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        return DateUtils.convertDatesToISOStrings(user);
    }

    async getUserById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        return user ? DateUtils.convertDatesToISOStrings(user) : null;
    }

    async updateUser(id: string, name: string, email: string) {
        const user = await this.getUserById(id);

        if (!user) {
            throw new HttpException(HttpCode.NotFound, ErrorCode.UserNotFound, 'User not found.');
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                name,
                email,
                updatedAt: new Date(),
            },
        });

        return DateUtils.convertDatesToISOStrings(updatedUser);
    }
}

export default UserService;
