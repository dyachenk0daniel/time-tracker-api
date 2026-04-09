import { PrismaClient, TimeEntry as PrismaTimeEntry, TimeEntryGroup as PrismaTimeEntryGroup } from '@prisma/client';
import { ErrorCode } from '@interfaces/error-code';
import HttpCode from '@interfaces/http-code';
import { HttpException } from '@interfaces/response-models';
import { PaginatedResult, TimeEntry, TimeEntryGroup } from './types';

type PrismaTimeEntryGroupWithRelations = PrismaTimeEntryGroup & {
    _count: { entries: number };
    entries: PrismaTimeEntry[];
};

class TimeEntryService {
    private readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    private toTimeEntry(entry: PrismaTimeEntry): TimeEntry {
        return {
            id: entry.id,
            groupId: entry.groupId,
            description: entry.description,
            startTime: entry.startTime.toISOString(),
            endTime: entry.endTime?.toISOString() ?? null,
        };
    }

    private toTimeEntryGroup(
        group: PrismaTimeEntryGroupWithRelations,
        startTime: Date | null,
        endTime: Date | null
    ): TimeEntryGroup {
        const hasSingleEntry = group._count.entries === 1;

        return {
            id: group.id,
            userId: group.userId,
            description: group.description,
            entriesCount: group._count.entries,
            startTime: startTime?.toISOString() ?? null,
            endTime: endTime?.toISOString() ?? null,
            entry: hasSingleEntry ? this.toTimeEntry(group.entries[0]) : null,
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

        const existingGroup = await this.prisma.timeEntryGroup.findFirst({
            where: { userId, description },
        });

        const group =
            existingGroup ??
            (await this.prisma.timeEntryGroup.create({
                data: { userId, description },
            }));

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

        const isAlreadyStopped = timeEntry.endTime !== null;

        if (isAlreadyStopped) {
            throw new HttpException(
                HttpCode.BadRequest,
                ErrorCode.TimeEntryAlreadyStopped,
                'Time entry is already stopped'
            );
        }

        const now = new Date();
        const updatedTimeEntry = await this.prisma.timeEntry.update({
            where: { id },
            data: { endTime: now, updatedAt: now },
        });

        return this.toTimeEntry(updatedTimeEntry);
    }

    async stopAllTimeEntries(userId: string): Promise<number> {
        const now = new Date();
        const result = await this.prisma.timeEntry.updateMany({
            where: { endTime: null, group: { userId } },
            data: { endTime: now, updatedAt: now },
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

    async getAllTimeEntryGroups(userId: string, page: number, limit: number): Promise<PaginatedResult<TimeEntryGroup>> {
        const [groups, total] = await Promise.all([
            this.prisma.timeEntryGroup.findMany({
                where: { userId },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: { select: { entries: true } },
                    entries: { take: 1 },
                },
            }),
            this.prisma.timeEntryGroup.count({ where: { userId } }),
        ]);

        const groupIds = groups.map((g) => g.id);
        const aggregates = await this.prisma.timeEntry.groupBy({
            by: ['groupId'],
            where: { groupId: { in: groupIds } },
            _min: { startTime: true },
            _max: { endTime: true },
        });

        const aggregateMap = new Map(aggregates.map((a) => [a.groupId, a]));

        return {
            items: groups.map((group) => {
                const agg = aggregateMap.get(group.id);
                return this.toTimeEntryGroup(
                    group,
                    agg?._min.startTime ?? null,
                    agg?._max.endTime ?? null
                );
            }),
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
    ): Promise<PaginatedResult<TimeEntry> | null> {
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
            items: entries.map((entry) => this.toTimeEntry(entry)),
            total,
            page,
            limit,
        };
    }

    async getActiveTimeEntry(userId: string): Promise<TimeEntry | null> {
        const timeEntry = await this.prisma.timeEntry.findFirst({
            where: { endTime: null, group: { userId } },
        });

        return timeEntry ? this.toTimeEntry(timeEntry) : null;
    }
}

export default TimeEntryService;