import { TimeEntry } from './types';
import { HttpException } from '@interfaces/response-models';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import { DateUtils } from '@shared/utils';
import { PrismaClient } from '@prisma/client';

class TimeEntryService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getTimeEntryById(id: string, userId: string): Promise<TimeEntry | null> {
        const timeEntry = await this.prisma.timeEntry.findUnique({
            where: { id, userId },
        });
        return timeEntry ? DateUtils.convertDatesToISOStrings(timeEntry) : null;
    }

    async createTimeEntry(userId: string, description: string): Promise<TimeEntry> {
        await this.stopAllTimeEntries(userId);

        const timeEntry = await this.prisma.timeEntry.create({
            data: {
                userId,
                description,
                startTime: new Date(),
                endTime: null,
            },
        });

        return DateUtils.convertDatesToISOStrings(timeEntry);
    }

    async stopTimeEntry(id: string, userId: string): Promise<void> {
        const timeEntry = await this.getTimeEntryById(id, userId);

        if (!timeEntry) {
            throw new HttpException(HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry not found');
        }

        this.prisma.timeEntry.updateMany({
            where: {
                userId,
                endTime: null,
                id: { not: id },
            },
            data: {
                endTime: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    async stopAllTimeEntries(userId: string): Promise<void> {
        this.prisma.timeEntry.updateMany({
            where: {
                userId,
                endTime: null,
            },
            data: {
                endTime: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    async deleteTimeEntry(id: string, userId: string): Promise<boolean> {
        const result = await this.prisma.timeEntry.delete({
            where: { id, userId },
        });
        return Boolean(result);
    }

    async getAllTimeEntries(userId: string): Promise<TimeEntry[]> {
        const timeEntries = await this.prisma.timeEntry.findMany({
            where: { userId },
        });
        return timeEntries.map((timeEntry) => DateUtils.convertDatesToISOStrings(timeEntry));
    }
}

export default TimeEntryService;
