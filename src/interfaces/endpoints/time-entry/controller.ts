import { Request, Response } from 'express';
import TimeEntryService from '@entities/time-entry/service';
import RequestHandler from '@interfaces/request-handler';
import { ErrorCode } from '@interfaces/error-code';
import HttpCode from '@interfaces/http-code';
import { TimeEntryNotFoundError } from '@entities/time-entry/errors';

class TimeEntryController extends RequestHandler {
    private readonly timeEntryService: TimeEntryService;

    constructor() {
        super();
        this.timeEntryService = new TimeEntryService();
    }

    async getTimeEntries(req: Request, res: Response) {
        try {
            const { userId } = req.body;
            const timeEntries = await this.timeEntryService.getAllTimeEntries(userId);
            this.sendResponse(res, timeEntries);
        } catch (error) {
            console.error('Error fetching time entries:', error);
            this.sendInternalError(res);
        }
    }

    async getTimeEntryById(req: Request, res: Response) {
        try {
            const { userId } = req.body;
            const { id } = req.params;
            const timeEntry = await this.timeEntryService.getTimeEntryById(id, userId);

            if (!timeEntry) {
                throw new TimeEntryNotFoundError();
            }

            this.sendResponse(res, timeEntry);
        } catch (error) {
            if (error instanceof TimeEntryNotFoundError) {
                return this.sendError(res, HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry not found');
            }
            console.error('Error fetching time entry by ID:', error);
            this.sendInternalError(res);
        }
    }

    async createTimeEntry(req: Request, res: Response) {
        try {
            const { userId, description, startTime } = req.body;
            const newTimeEntry = await this.timeEntryService.createTimeEntry({
                userId,
                description,
                startTime,
            });
            this.sendResponse(res, newTimeEntry, HttpCode.Created);
        } catch (error) {
            console.error('Error creating time entry:', error);
            this.sendInternalError(res);
        }
    }

    async stopTimeEntry(req: Request, res: Response) {
        try {
            const { userId, endTime } = req.body;
            const { id } = req.params;
            const stoppedTimeEntry = await this.timeEntryService.updateTimeEntry(id, {
                userId,
                endTime,
            });
            this.sendResponse(res, stoppedTimeEntry);
        } catch (error) {
            if (error instanceof TimeEntryNotFoundError) {
                return this.sendError(res, HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry not found');
            }
            console.error('Error stopping time entry:', error);
            this.sendInternalError(res);
        }
    }

    async deleteTimeEntry(req: Request, res: Response) {
        try {
            const { userId } = req.body;
            const { id } = req.params;
            const deleted = await this.timeEntryService.deleteTimeEntry(id, userId);

            if (!deleted) {
                return this.sendError(res, HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry not found');
            }

            this.sendResponse(res, { message: 'Time entry deleted successfully' });
        } catch (error) {
            console.error('Error deleting time entry:', error);
            this.sendInternalError(res);
        }
    }
}

export default TimeEntryController;
