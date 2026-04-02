import { NextFunction, Request, Response } from 'express';
import RequestHandler from '@interfaces/request-handler';
import { ErrorCode } from '@interfaces/error-code';
import HttpCode from '@interfaces/http-code';
import { HttpException } from '@interfaces/response-models';
import TimeEntryService from '@entities/time-entry/service';

class TimeEntryController extends RequestHandler {
    private readonly timeEntryService: TimeEntryService;

    constructor(timeEntryService: TimeEntryService) {
        super();
        this.timeEntryService = timeEntryService;
    }

    async getTimeEntryGroups(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await this.timeEntryService.getAllTimeEntryGroups(userId, page, limit);
            this.sendResponse(res, result);
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
            const { userId } = req.body;
            const { description } = req.body;
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

    async getEntriesByGroupId(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            const { groupId } = req.params;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await this.timeEntryService.getEntriesByGroupId(groupId, userId, page, limit);

            if (!result) {
                throw new HttpException(HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry group not found');
            }

            this.sendResponse(res, result);
        } catch (error) {
            next(error);
        }
    }
}

export default TimeEntryController;
