import { body, param } from 'express-validator';

export const getTimeEntryByIdValidationRules = [param('id').isUUID().withMessage('ID must be a valid UUID')];
export const createTimeEntryValidationRules = [body('description').notEmpty().withMessage('Description is required')];
export const stopTimeEntryValidationRules = [param('id').isUUID().withMessage('ID must be a valid UUID')];
export const deleteTimeEntryValidationRules = [param('id').isUUID().withMessage('ID must be a valid UUID')];
