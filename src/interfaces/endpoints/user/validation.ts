import { body } from 'express-validator';

export const updateUserValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Please enter a valid email address'),
];
