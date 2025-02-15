import { PrismaClient } from '@prisma/client';
import { DateUtils } from '@shared/utils';
import UserRepository from './index';

jest.mock('@prisma/client');
jest.mock('@shared/utils', () => ({
    DateUtils: {
        convertDateToISOString: jest.fn(),
    },
}));

describe('UserRepository', () => {
    let userRepository: UserRepository;
    let mockPrismaClient = {
        user: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    const mockDate = '2023-12-02T12:00:00Z';

    beforeEach(() => {
        jest.mocked(DateUtils.convertDateToISOString).mockReturnValue(mockDate);
        (PrismaClient as jest.Mock).mockImplementation(() => mockPrismaClient);
        userRepository = new UserRepository();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return all users', async () => {
        const mockUsers = [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                createdAt: new Date(mockDate),
                updatedAt: new Date(mockDate),
            },
            {
                id: '2',
                name: 'Jane Doe',
                email: 'jane@example.com',
                createdAt: new Date(mockDate),
                updatedAt: new Date(mockDate),
            },
        ];

        mockPrismaClient.user.findMany.mockResolvedValue(mockUsers);

        const users = await userRepository.getAll();
        expect(users).toEqual([
            {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                createdAt: mockDate,
                updatedAt: mockDate,
            },
            {
                id: '2',
                name: 'Jane Doe',
                email: 'jane@example.com',
                createdAt: mockDate,
                updatedAt: mockDate,
            },
        ]);
        expect(mockPrismaClient.user.findMany).toHaveBeenCalled();
    });

    it('should return a user by ID', async () => {
        const mockUser = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            createdAt: new Date(mockDate),
            updatedAt: new Date(mockDate),
        };

        mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

        const user = await userRepository.getById('1');

        expect(user).toEqual({
            ...mockUser,
            createdAt: mockDate,
            updatedAt: mockDate,
        });
        expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null if user not found by ID', async () => {
        (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

        const user = await userRepository.getById('nonexistent-id');
        expect(user).toBeNull();
    });

    it('should create a new user', async () => {
        const newUser = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password',
            createdAt: new Date(mockDate),
            updatedAt: new Date(mockDate),
        };

        mockPrismaClient.user.create.mockResolvedValue(newUser);

        const createdUser = await userRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password',
        });
        expect(createdUser).toEqual({
            ...newUser,
            createdAt: mockDate,
            updatedAt: mockDate,
        });
    });

    it('should update an existing user', async () => {
        const updatedUser = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'newpassword',
            createdAt: new Date(mockDate),
            updatedAt: new Date(mockDate),
        };

        mockPrismaClient.user.update.mockResolvedValue(updatedUser);

        const payload = {
            ...updatedUser,
            createdAt: mockDate,
            updatedAt: mockDate,
        };
        const user = await userRepository.update(payload);

        expect(user).toEqual(payload);
        expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
            where: { id: updatedUser.id },
            data: {
                name: updatedUser.name,
                email: updatedUser.email,
                password: updatedUser.password,
                updatedAt: updatedUser.updatedAt ? new Date(updatedUser.updatedAt) : new Date(),
            },
        });
    });

    it('should delete a user', async () => {
        const mockDeleteResult = { id: '1' };

        mockPrismaClient.user.delete.mockResolvedValue(mockDeleteResult);

        const result = await userRepository.delete('1');
        expect(result).toBe(true);
    });

    it('should return false if user not found on delete', async () => {
        mockPrismaClient.user.delete.mockReturnValue(null);

        const result = await userRepository.delete('nonexistent-id');
        expect(result).toBe(false);
    });
});
