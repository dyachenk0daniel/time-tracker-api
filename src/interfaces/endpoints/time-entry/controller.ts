import { NextFunction, Request, Response } from 'express';
import RequestHandler from '@interfaces/request-handler';
import { ErrorCode } from '@interfaces/error-code';
import HttpCode from '@interfaces/http-code';
import { HttpException } from '@interfaces/response-models';
import TimeEntryService from '@entities/time-entry/service';

class TimeEntryController extends RequestHandler {
    private readonly timeEntryService: TimeEntryService;

    constructor() {
        super();
        this.timeEntryService = new TimeEntryService();
    }

    async getTimeEntries(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            const timeEntries = await this.timeEntryService.getAllTimeEntries(userId);
            this.sendResponse(res, timeEntries);
        } catch (error) {
            next(error);
        }
    }

    async getTimeEntryById(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            const { id } = req.params;
            const timeEntry = await this.timeEntryService.getTimeEntryById(id, userId);

            if (!timeEntry) {
                throw new HttpException(HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry not found');
            }

            this.sendResponse(res, timeEntry);
        } catch (error) {
            next(error);
        }
    }

    async createTimeEntry(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, description } = req.body;
            const newTimeEntry = await this.timeEntryService.createTimeEntry(userId, description);
            this.sendResponse(res, newTimeEntry, HttpCode.Created);
        } catch (error) {
            next(error);
        }
    }

    async stopTimeEntry(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            const { id } = req.params;
            const stoppedTimeEntry = await this.timeEntryService.stopTimeEntry(id, userId);
            this.sendResponse(res, stoppedTimeEntry);
        } catch (error) {
            next(error);
        }
    }

    async deleteTimeEntry(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            const { id } = req.params;
            const deleted = await this.timeEntryService.deleteTimeEntry(id, userId);

            if (!deleted) {
                throw new HttpException(HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry not found');
            }

            this.sendResponse(res, { message: 'Time entry deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    async getActiveTimeEntry(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            const activeTimeEntry = await this.timeEntryService.getActiveTimeEntry(userId);

            this.sendResponse(res, activeTimeEntry);
        } catch (error) {
            next(error);
        }
    }
}

export default TimeEntryController;
