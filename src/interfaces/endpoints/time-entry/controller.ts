import { NextFunction, Request, Response } from 'express';
import { ErrorCode } from '@interfaces/error-code';
import HttpCode from '@interfaces/http-code';
import RequestHandler from '@interfaces/request-handler';
import { HttpException } from '@interfaces/response-models';
import TimeEntryService from '@entities/time-entry/service';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

class TimeEntryController extends RequestHandler {
    private readonly timeEntryService: TimeEntryService;

    constructor(timeEntryService: TimeEntryService) {
        super();
        this.timeEntryService = timeEntryService;
    }

    async getTimeEntryGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.body;
            const page = Number(req.query.page) || DEFAULT_PAGE;
            const limit = Number(req.query.limit) || DEFAULT_LIMIT;

            const result = await this.timeEntryService.getAllTimeEntryGroups(userId, page, limit);
            this.sendResponse(res, result);
        } catch (error) {
            next(error);
        }
    }

    async getTimeEntryById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.body;
            const { id } = req.params;

            const timeEntry = await this.timeEntryService.getTimeEntryById(id, userId);
            const notFound = !timeEntry;

            if (notFound) {
                throw new HttpException(HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry not found');
            }

            this.sendResponse(res, timeEntry);
        } catch (error) {
            next(error);
        }
    }

    async createTimeEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, description } = req.body;

            const newTimeEntry = await this.timeEntryService.createTimeEntry(userId, description);
            this.sendResponse(res, newTimeEntry, HttpCode.Created);
        } catch (error) {
            next(error);
        }
    }

    async stopTimeEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.body;
            const { id } = req.params;

            const stoppedTimeEntry = await this.timeEntryService.stopTimeEntry(id, userId);
            this.sendResponse(res, stoppedTimeEntry);
        } catch (error) {
            next(error);
        }
    }

    async deleteTimeEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.body;
            const { id } = req.params;

            const deleted = await this.timeEntryService.deleteTimeEntry(id, userId);
            const notFound = !deleted;

            if (notFound) {
                throw new HttpException(HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry not found');
            }

            this.sendResponse(res, { message: 'Time entry deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    async getActiveTimeEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.body;

            const activeTimeEntry = await this.timeEntryService.getActiveTimeEntry(userId);
            this.sendResponse(res, activeTimeEntry);
        } catch (error) {
            next(error);
        }
    }

    async getEntriesByGroupId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.body;
            const { groupId } = req.params;
            const page = Number(req.query.page) || DEFAULT_PAGE;
            const limit = Number(req.query.limit) || DEFAULT_LIMIT;

            const result = await this.timeEntryService.getEntriesByGroupId(groupId, userId, page, limit);
            const groupNotFound = !result;

            if (groupNotFound) {
                throw new HttpException(HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry group not found');
            }

            this.sendResponse(res, result);
        } catch (error) {
            next(error);
        }
    }
}

export default TimeEntryController;