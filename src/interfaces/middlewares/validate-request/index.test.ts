import request from 'supertest';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import validateRequest from './index';
import { ErrorCode } from '@interfaces/error-code';
import HttpCode from '@interfaces/http-code';

const app = express();

app.use(express.json());
app.post(
    '/test',
    [body('email').isEmail().withMessage('Invalid email')],
    validateRequest,
    (req: Request, res: Response) => {
        res.status(HttpCode.Ok).json({ success: true });
    }
);

describe('validateRequest', () => {
    it('should pass validation for valid input', async () => {
        const response = await request(app).post('/test').send({ email: 'test@example.com' });

        expect(response.status).toBe(HttpCode.Ok);
        expect(response.body).toEqual({ success: true });
    });

    it('should return a validation error for invalid input', async () => {
        const response = await request(app).post('/test').send({ email: 'invalid-email' });

        expect(response.status).toBe(HttpCode.BadRequest);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error.code).toBe(ErrorCode.BadRequest);
        expect(response.body.error.message).toBe('Validation failed');
        expect(response.body.error.details).toBeInstanceOf(Array);
    });
});
