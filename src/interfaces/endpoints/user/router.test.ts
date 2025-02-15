import { Express } from 'express';
import request from 'supertest';
import usersRouter from './router';
import { authenticateToken } from '@interfaces/middlewares/authenticate-token';
import UserService from '@entities/user/service';
import { User } from '@entities/user/types';
import { TestUtils } from '@shared/utils';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import { UserNotFoundError } from '@entities/user/errors';

jest.mock('@interfaces/middlewares/authenticate-token');
jest.mock('@entities/user/service');

describe('usersRouter', () => {
    let app: Express;

    beforeAll(() => {
        app = TestUtils.createApp(usersRouter, '/api/users');
        jest.mocked(authenticateToken).mockImplementation((req, res, next) => {
            req.body.userId = '123';
            next();
        });
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('GET /me', () => {
        it('should return current user', async () => {
            const mockUser: User = {
                ...TestUtils.mockPartial(),
                id: '123',
                name: 'John Doe',
                email: 'john.doe@example.com',
            };

            jest.mocked(UserService.prototype.getUserById).mockResolvedValue(mockUser);

            const response = await request(app).get('/api/users/me').set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.Ok);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id', '123');
            expect(response.body.data).toHaveProperty('name', 'John Doe');
            expect(response.body.data).toHaveProperty('email', 'john.doe@example.com');
        });

        it('should return 404 if user is not found', async () => {
            jest.mocked(UserService.prototype.getUserById).mockResolvedValue(null);

            const response = await request(app).get('/api/users/me');

            expect(response.status).toBe(HttpCode.NotFound);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.UserNotFound);
            expect(response.body.error).toHaveProperty('message', 'User not found.');
        });

        it('should return 500 if there is a server error', async () => {
            jest.mocked(UserService.prototype.getUserById).mockRejectedValue(new Error('Server error'));

            const response = await request(app).get('/api/users/me').set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.InternalServerError);
            expect(response.body.error).toHaveProperty('message', 'An error occurred while processing your request.');
        });
    });

    describe('PUT /me', () => {
        it('should update user data', async () => {
            const updatedUser: User = {
                ...TestUtils.mockPartial(),
                id: '123',
                name: 'Jane Doe',
                email: 'jane.doe@example.com',
            };

            jest.mocked(UserService.prototype.updateUser).mockResolvedValue(updatedUser);

            const response = await request(app)
                .put('/api/users/me')
                .set('Authorization', 'Bearer valid_token')
                .send({ name: 'Jane Doe', email: 'jane.doe@example.com' });

            expect(response.status).toBe(HttpCode.Ok);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('name', 'Jane Doe');
            expect(response.body.data).toHaveProperty('email', 'jane.doe@example.com');
        });

        it('should return 404 if user is not found', async () => {
            jest.mocked(UserService.prototype.updateUser).mockRejectedValue(new UserNotFoundError());

            const response = await request(app)
                .put('/api/users/me')
                .set('Authorization', 'Bearer valid_token')
                .send({ name: 'Jane Doe', email: 'jane.doe@example.com' });

            expect(response.status).toBe(HttpCode.NotFound);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.UserNotFound);
            expect(response.body.error).toHaveProperty('message', 'User not found.');
        });

        it('should return 500 if there is a server error', async () => {
            jest.mocked(UserService.prototype.updateUser).mockRejectedValue(new Error('Server error'));

            const response = await request(app)
                .put('/api/users/me')
                .set('Authorization', 'Bearer valid_token')
                .send({ name: 'Jane Doe', email: 'jane.doe@example.com' });

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.InternalServerError);
            expect(response.body.error).toHaveProperty('message', 'An error occurred while processing your request.');
        });
    });
});
