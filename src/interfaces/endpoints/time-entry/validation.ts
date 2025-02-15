import { body, param } from 'express-validator';

export const getTimeEntryByIdValidationRules = [param('id').isUUID().withMessage('ID must be a valid UUID')];
export const createTimeEntryValidationRules = [
    body('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .bail()
        .isUUID()
        .withMessage('User ID must be a valid UUID'),
    body('description').notEmpty().withMessage('Description is required'),
    body('startTime')
        .notEmpty()
        .withMessage('Start time is required')
        .bail()
        .isISO8601()
        .withMessage('Start time must be a valid ISO 8601 date'),
    body('endTime').optional().isISO8601().withMessage('End time must be a valid ISO 8601 date'),
];
