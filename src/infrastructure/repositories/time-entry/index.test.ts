import { PrismaClient } from '@prisma/client';
import TimeEntryRepository from './index';

jest.mock('@prisma/client');

describe('TimeEntryRepository', () => {
    let timeEntryRepository: TimeEntryRepository;
    let mockPrismaClient = {
        timeEntry: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    const mockDate = '2023-12-02T12:00:00.000Z';

    beforeEach(() => {
        (PrismaClient as jest.Mock).mockImplementation(() => mockPrismaClient);
        timeEntryRepository = new TimeEntryRepository();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return all time entries for a user', async () => {
        const mockEntries = [
            {
                id: '1',
                userId: '123',
                description: 'Task 1',
                startTime: new Date(mockDate),
                endTime: new Date(mockDate),
                createdAt: new Date(mockDate),
                updatedAt: new Date(mockDate),
            },
        ];

        mockPrismaClient.timeEntry.findMany.mockResolvedValue(mockEntries);

        const entries = await timeEntryRepository.getAll('123');
        expect(entries).toEqual([
            {
                id: '1',
                userId: '123',
                description: 'Task 1',
                startTime: mockDate,
                endTime: mockDate,
                createdAt: mockDate,
                updatedAt: mockDate,
            },
        ]);
        expect(mockPrismaClient.timeEntry.findMany).toHaveBeenCalledWith({ where: { userId: '123' } });
    });

    it('should return a time entry by ID', async () => {
        const mockEntry = {
            id: '1',
            userId: '123',
            description: 'Task 1',
            startTime: new Date(mockDate),
            endTime: new Date(mockDate),
            createdAt: new Date(mockDate),
            updatedAt: new Date(mockDate),
        };

        mockPrismaClient.timeEntry.findUnique.mockResolvedValue(mockEntry);

        const entry = await timeEntryRepository.getById('1', '123');

        expect(entry).toEqual({
            ...mockEntry,
            startTime: mockDate,
            endTime: mockDate,
            createdAt: mockDate,
            updatedAt: mockDate,
        });
        expect(mockPrismaClient.timeEntry.findUnique).toHaveBeenCalledWith({ where: { id: '1', userId: '123' } });
    });

    it('should create a time entry', async () => {
        const newEntry = {
            id: '1',
            userId: '123',
            description: 'New Task',
            startTime: new Date(mockDate),
            endTime: null,
            createdAt: new Date(mockDate),
            updatedAt: null,
        };

        mockPrismaClient.timeEntry.create.mockResolvedValue(newEntry);

        const createdEntry = await timeEntryRepository.create({
            userId: '123',
            description: 'New Task',
            startTime: mockDate,
            endTime: null,
        });

        expect(createdEntry).toEqual({
            ...newEntry,
            startTime: mockDate,
            endTime: null,
            createdAt: mockDate,
            updatedAt: null,
        });
        expect(mockPrismaClient.timeEntry.create).toHaveBeenCalled();
    });

    it('should update a time entry', async () => {
        const updatedEntry = {
            id: '1',
            userId: '123',
            description: 'Updated Task',
            startTime: new Date(mockDate),
            endTime: new Date(mockDate),
            createdAt: new Date(mockDate),
            updatedAt: new Date(mockDate),
        };

        mockPrismaClient.timeEntry.update.mockResolvedValue(updatedEntry);

        const entry = await timeEntryRepository.update('1', {
            userId: '123',
            description: 'Updated Task',
            startTime: mockDate,
            endTime: mockDate,
        });

        expect(entry).toEqual({
            ...updatedEntry,
            startTime: mockDate,
            endTime: mockDate,
            createdAt: mockDate,
            updatedAt: mockDate,
        });
    });

    it('should delete a time entry', async () => {
        const mockDeleteResult = { id: '1' };
        mockPrismaClient.timeEntry.delete.mockResolvedValue(mockDeleteResult);

        const result = await timeEntryRepository.delete('1', '123');
        expect(result).toBe(true);
    });

    it('should return false if time entry not found on delete', async () => {
        mockPrismaClient.timeEntry.delete.mockReturnValue(null);

        const result = await timeEntryRepository.delete('nonexistent-id', '123');
        expect(result).toBe(false);
    });
});
