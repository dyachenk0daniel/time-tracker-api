import { param } from 'express-validator';

export const getTimeEntryByIdValidationRules = [param('id').isUUID().withMessage('ID must be a valid UUID')];
