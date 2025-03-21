import TimeEntryRepository from '@infrastructure/repositories/time-entry';
import { CreateTimeEntry, TimeEntry, UpdateTimeEntry } from './types';
import { HttpException } from '@interfaces/response-models';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';

class TimeEntryService {
    private readonly timeEntryRepository: TimeEntryRepository;

    constructor() {
        this.timeEntryRepository = new TimeEntryRepository();
    }

    async getTimeEntryById(id: string, userId: string): Promise<TimeEntry | null> {
        return this.timeEntryRepository.getById(id, userId);
    }

    async createTimeEntry(data: CreateTimeEntry): Promise<TimeEntry> {
        return this.timeEntryRepository.create(data);
    }

    async updateTimeEntry(id: string, data: UpdateTimeEntry): Promise<TimeEntry> {
        const timeEntry = await this.getTimeEntryById(id, data.userId);

        if (!timeEntry) {
            throw new HttpException(HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry not found');
        }

        return this.timeEntryRepository.update(id, data);
    }

    async deleteTimeEntry(id: string, userId: string): Promise<boolean> {
        return this.timeEntryRepository.delete(id, userId);
    }

    async getAllTimeEntries(userId: string): Promise<TimeEntry[]> {
        return this.timeEntryRepository.getAll(userId);
    }
}

export default TimeEntryService;
