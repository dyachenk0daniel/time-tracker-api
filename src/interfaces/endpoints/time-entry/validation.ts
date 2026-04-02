import { body, param, query } from 'express-validator';

const uuidParam = (name: string, message: string) => param(name).isUUID().withMessage(message);

const paginationRules = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100').toInt(),
];

export const getTimeEntriesValidationRules = [...paginationRules];

export const getTimeEntryByIdValidationRules = [uuidParam('id', 'ID must be a valid UUID')];

export const createTimeEntryValidationRules = [body('description').notEmpty().withMessage('Description is required')];

export const stopTimeEntryValidationRules = [uuidParam('id', 'ID must be a valid UUID')];

export const deleteTimeEntryValidationRules = [uuidParam('id', 'ID must be a valid UUID')];

export const getEntriesByGroupIdValidationRules = [
    uuidParam('groupId', 'Group ID must be a valid UUID'),
    ...paginationRules,
];