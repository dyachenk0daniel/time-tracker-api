import { Router } from 'express';
import { authenticateToken } from '@interfaces/middlewares/authenticate-token';
import validateRequest from '@interfaces/middlewares/validate-request';
import TimeEntryController from './controller';
import {
    createTimeEntryValidationRules,
    deleteTimeEntryValidationRules,
    getTimeEntryByIdValidationRules,
    stopTimeEntryValidationRules,
} from './validation';

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
timeEntryRouter.put(
    '/:id/stop',
    authenticateToken,
    stopTimeEntryValidationRules,
    validateRequest,
    timeEntryController.stopTimeEntry.bind(timeEntryController)
);
timeEntryRouter.delete(
    '/:id/delete',
    authenticateToken,
    deleteTimeEntryValidationRules,
    validateRequest,
    timeEntryController.deleteTimeEntry.bind(timeEntryController)
);

export default timeEntryRouter;
