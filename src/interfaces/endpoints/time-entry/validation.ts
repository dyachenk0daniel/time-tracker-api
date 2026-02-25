import { body, param, query } from 'express-validator';

export const getTimeEntriesValidationRules = [
    query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be an integer between 1 and 100'),
];
export const getTimeEntryByIdValidationRules = [param('id').isUUID().withMessage('ID must be a valid UUID')];
export const createTimeEntryValidationRules = [body('description').notEmpty().withMessage('Description is required')];
export const stopTimeEntryValidationRules = [param('id').isUUID().withMessage('ID must be a valid UUID')];
export const deleteTimeEntryValidationRules = [param('id').isUUID().withMessage('ID must be a valid UUID')];
