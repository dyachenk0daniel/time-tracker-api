import { PrismaClient } from '@prisma/client';
import { CreateTimeEntry, TimeEntry, UpdateTimeEntry } from '@entities/time-entry/types';
import { DateUtils } from '@shared/utils';

class TimeEntryRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getAll(userId: string): Promise<TimeEntry[]> {
        const timeEntries = await this.prisma.timeEntry.findMany({
            where: { userId },
        });
        return timeEntries.map((timeEntry) => DateUtils.convertDatesToISOStrings(timeEntry));
    }

    async getById(id: string, userId: string): Promise<TimeEntry | null> {
        const timeEntry = await this.prisma.timeEntry.findUnique({
            where: { id, userId },
        });
        return timeEntry ? DateUtils.convertDatesToISOStrings(timeEntry) : null;
    }

    async create(data: CreateTimeEntry): Promise<TimeEntry> {
        const timeEntry = await this.prisma.timeEntry.create({
            data: {
                userId: data.userId,
                description: data.description,
                startTime: new Date(data.startTime),
                endTime: data.endTime ? new Date(data.endTime) : null,
            },
        });
        return DateUtils.convertDatesToISOStrings(timeEntry);
    }

    async update(id: string, data: UpdateTimeEntry): Promise<TimeEntry> {
        const updatedTimeEntry = await this.prisma.timeEntry.update({
            where: { id, userId: data.userId },
            data: {
                userId: data.userId,
                description: data.description,
                startTime: data.startTime ? new Date(data.startTime) : undefined,
                endTime: data.endTime ? new Date(data.endTime) : undefined,
                updatedAt: new Date(),
            },
        });
        return DateUtils.convertDatesToISOStrings(updatedTimeEntry);
    }

    async delete(id: string, userId: string): Promise<boolean> {
        const result = await this.prisma.timeEntry.delete({
            where: { id, userId },
        });
        return Boolean(result);
    }
}

export default TimeEntryRepository;
