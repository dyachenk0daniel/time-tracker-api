import { body } from 'express-validator';

const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

const PASSWORD_ERROR_MESSAGE =
    'Password must be at least 8 characters long, contain at least one uppercase letter, ' +
    'one lowercase letter, one number and one special character (@$!%*?&)';

export const loginValidationRules = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Please enter a valid email address'),
    body('password').isString().matches(PASSWORD_REQUIREMENTS.pattern).withMessage(PASSWORD_ERROR_MESSAGE),
];

export const registerValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isString().matches(PASSWORD_REQUIREMENTS.pattern).withMessage(PASSWORD_ERROR_MESSAGE),
];
