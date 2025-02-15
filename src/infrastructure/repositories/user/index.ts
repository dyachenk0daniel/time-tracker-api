import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { CreateUser, User } from '@entities/user/types';
import { DateUtils } from '@shared/utils';

class UserRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    private transformUser(user: PrismaUser): User {
        return {
            ...user,
            createdAt: DateUtils.convertDateToISOString(user.createdAt) as string,
            updatedAt: DateUtils.convertDateToISOString(user.updatedAt),
        };
    }

    async getAll(): Promise<User[]> {
        const users = await this.prisma.user.findMany();
        return users.map((user) => this.transformUser(user));
    }

    async getById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        return user ? this.transformUser(user) : null;
    }

    async getByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        return user ? this.transformUser(user) : null;
    }

    async create(item: CreateUser): Promise<User> {
       const user = await this.prisma.user.create({
            data: {
                name: item.name,
                email: item.email,
                password: item.password,
            },
        });
        return this.transformUser(user);
    }

    async update(user: User): Promise<User> {
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                updatedAt: user.updatedAt ? new Date(user.updatedAt) : null,
            },
        });
        return this.transformUser(updatedUser);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.prisma.user.delete({
            where: { id },
        });
        return Boolean(result);
    }
}

export default UserRepository;
