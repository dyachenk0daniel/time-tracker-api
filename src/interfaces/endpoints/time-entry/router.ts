import { Router } from 'express';
import { authenticateToken } from '@interfaces/middlewares/authenticate-token';
import validateRequest from '@interfaces/middlewares/validate-request';
import TimeEntryController from './controller';
import { createTimeEntryValidationRules, getTimeEntryByIdValidationRules } from './validation';

const timeEntryRouter = Router();
const timeEntryController = new TimeEntryController();

timeEntryRouter.get('/', authenticateToken, timeEntryController.getTimeEntries.bind(timeEntryController));
timeEntryRouter.get(
    '/:id',
    authenticateToken,
    getTimeEntryByIdValidationRules,
    validateRequest,
    timeEntryController.getTimeEntryById.bind(timeEntryController)
);
timeEntryRouter.post(
    '/',
    authenticateToken,
    createTimeEntryValidationRules,
    validateRequest,
    timeEntryController.createTimeEntry.bind(timeEntryController)
);

export default timeEntryRouter;
