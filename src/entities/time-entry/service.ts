import { TimeEntry, TimeEntryGroup } from './types';
import { HttpException } from '@interfaces/response-models';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import { PrismaClient } from '@prisma/client';

class TimeEntryService {
    private readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    private toTimeEntry(entry: {
        id: string;
        groupId: string;
        description: string;
        startTime: Date;
        endTime: Date | null;
    }): TimeEntry {
        return {
            id: entry.id,
            groupId: entry.groupId,
            description: entry.description,
            startTime: entry.startTime.toISOString(),
            endTime: entry.endTime ? entry.endTime.toISOString() : null,
        };
    }

    private toTimeEntryGroup(group: { id: string; userId: string; description: string }): TimeEntryGroup {
        return {
            id: group.id,
            userId: group.userId,
            description: group.description,
        };
    }

    async getTimeEntryById(id: string, userId: string): Promise<TimeEntry | null> {
        const timeEntry = await this.prisma.timeEntry.findFirst({
            where: { id, group: { userId } },
        });
        return timeEntry ? this.toTimeEntry(timeEntry) : null;
    }

    async createTimeEntry(userId: string, description: string): Promise<TimeEntry> {
        await this.stopAllTimeEntries(userId);

        let group = await this.prisma.timeEntryGroup.findFirst({
            where: { userId, description },
        });

        if (!group) {
            group = await this.prisma.timeEntryGroup.create({
                data: { userId, description },
            });
        }

        const timeEntry = await this.prisma.timeEntry.create({
            data: {
                groupId: group.id,
                description,
                startTime: new Date(),
                endTime: null,
            },
        });

        return this.toTimeEntry(timeEntry);
    }

    async stopTimeEntry(id: string, userId: string): Promise<TimeEntry> {
        const timeEntry = await this.getTimeEntryById(id, userId);

        if (!timeEntry) {
            throw new HttpException(HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry not found');
        }

        if (timeEntry.endTime) {
            throw new HttpException(
                HttpCode.BadRequest,
                ErrorCode.TimeEntryAlreadyStopped,
                'Time entry is already stopped'
            );
        }

        const updatedTimeEntry = await this.prisma.timeEntry.update({
            where: { id },
            data: {
                endTime: new Date(),
                updatedAt: new Date(),
            },
        });

        return this.toTimeEntry(updatedTimeEntry);
    }

    async stopAllTimeEntries(userId: string): Promise<number> {
        const result = await this.prisma.timeEntry.updateMany({
            where: {
                endTime: null,
                group: { userId },
            },
            data: {
                endTime: new Date(),
                updatedAt: new Date(),
            },
        });

        return result.count;
    }

    async deleteTimeEntry(id: string, userId: string): Promise<boolean> {
        const timeEntry = await this.prisma.timeEntry.findFirst({
            where: { id, group: { userId } },
        });

        if (!timeEntry) return false;

        await this.prisma.timeEntry.delete({ where: { id } });
        return true;
    }

    async getAllTimeEntryGroups(
        userId: string,
        page: number,
        limit: number
    ): Promise<{ items: TimeEntryGroup[]; total: number; page: number; limit: number }> {
        const [groups, total] = await Promise.all([
            this.prisma.timeEntryGroup.findMany({
                where: { userId },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.timeEntryGroup.count({ where: { userId } }),
        ]);

        return {
            items: groups.map((group) => this.toTimeEntryGroup(group)),
            total,
            page,
            limit,
        };
    }

    async getEntriesByGroupId(
        groupId: string,
        userId: string,
        page: number,
        limit: number
    ): Promise<{ items: TimeEntry[]; total: number; page: number; limit: number } | null> {
        const group = await this.prisma.timeEntryGroup.findFirst({
            where: { id: groupId, userId },
        });

        if (!group) return null;

        const [entries, total] = await Promise.all([
            this.prisma.timeEntry.findMany({
                where: { groupId },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { startTime: 'desc' },
            }),
            this.prisma.timeEntry.count({ where: { groupId } }),
        ]);

        return {
            items: entries.map((e) => this.toTimeEntry(e)),
            total,
            page,
            limit,
        };
    }

    async getActiveTimeEntry(userId: string): Promise<TimeEntry | null> {
        const timeEntry = await this.prisma.timeEntry.findFirst({
            where: {
                endTime: null,
                group: { userId },
            },
        });
        return timeEntry ? this.toTimeEntry(timeEntry) : null;
    }
}

export default TimeEntryService;