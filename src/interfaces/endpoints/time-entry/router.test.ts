import { Express } from 'express';
import request from 'supertest';
import timeEntryRouter from './router';
import { authenticateToken } from '@interfaces/middlewares/authenticate-token';
import TimeEntryService from '@entities/time-entry/service';
import { TimeEntry } from '@entities/time-entry/types';
import { TestUtils } from '@shared/utils';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import { HttpException } from '@interfaces/response-models';

jest.mock('@interfaces/middlewares/authenticate-token');
jest.mock('@entities/time-entry/service');

describe('timeEntryRouter', () => {
    let app: Express;
    const mockTimeEntryId = '123e4567-e89b-12d3-a456-426614174000';

    beforeAll(() => {
        app = TestUtils.createApp(timeEntryRouter, '/api/time-entries');
        jest.mocked(authenticateToken).mockImplementation((req, res, next) => {
            req.body.userId = '123e4567-e89b-12d3-a456-426614174000';
            next();
        });
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('GET /:id', () => {
        it('should return a time entry', async () => {
            const mockTimeEntry: TimeEntry = {
                id: mockTimeEntryId,
                userId: '123e4567-e89b-12d3-a456-426614174000',
                description: 'Test time entry',
                startTime: '2023-12-01T12:00:00Z',
                endTime: '2023-12-01T13:00:00Z',
                createdAt: '2023-12-01T12:00:00Z',
                updatedAt: '2023-12-01T12:00:00Z',
            };

            jest.mocked(TimeEntryService.prototype.getTimeEntryById).mockResolvedValue(mockTimeEntry);

            const response = await request(app)
                .get(`/api/time-entries/${mockTimeEntryId}`)
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.Ok);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id', mockTimeEntryId);
            expect(response.body.data).toHaveProperty('description', 'Test time entry');
            expect(response.body.data).toHaveProperty('startTime', '2023-12-01T12:00:00Z');
            expect(response.body.data).toHaveProperty('endTime', '2023-12-01T13:00:00Z');
            expect(response.body.data).toHaveProperty('createdAt', '2023-12-01T12:00:00Z');
            expect(response.body.data).toHaveProperty('updatedAt', '2023-12-01T12:00:00Z');
        });

        it('should return 404 if time entry is not found', async () => {
            jest.mocked(TimeEntryService.prototype.getTimeEntryById).mockResolvedValue(null);

            const response = await request(app)
                .get(`/api/time-entries/${mockTimeEntryId}`)
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.NotFound);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.TimeEntryNotFound);
            expect(response.body.error).toHaveProperty('message', 'Time entry not found');
        });

        it('should return 500 if there is a server error', async () => {
            jest.mocked(TimeEntryService.prototype.getTimeEntryById).mockRejectedValue(new Error('Server error'));

            const response = await request(app)
                .get(`/api/time-entries/${mockTimeEntryId}`)
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.InternalServerError);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.InternalServerError);
            expect(response.body.error).toHaveProperty('message', 'An error occurred while processing your request.');
        });
    });

    describe('GET /', () => {
        it('should return a list of time entries', async () => {
            const mockTimeEntries: TimeEntry[] = [
                {
                    id: '123e4567-e89b-12d3-a456-426614174001',
                    userId: '123e4567-e89b-12d3-a456-426614174000',
                    description: 'Test time entry 1',
                    startTime: '2023-12-01T12:00:00Z',
                    endTime: '2023-12-01T13:00:00Z',
                    createdAt: '2023-12-01T12:00:00Z',
                    updatedAt: '2023-12-01T12:00:00Z',
                },
                {
                    id: '123e4567-e89b-12d3-a456-426614174002',
                    userId: '123e4567-e89b-12d3-a456-426614174000',
                    description: 'Test time entry 2',
                    startTime: '2023-12-02T12:00:00Z',
                    endTime: '2023-12-02T13:00:00Z',
                    createdAt: '2023-12-02T12:00:00Z',
                    updatedAt: '2023-12-02T12:00:00Z',
                },
            ];

            jest.mocked(TimeEntryService.prototype.getAllTimeEntries).mockResolvedValue(mockTimeEntries);

            const response = await request(app).get('/api/time-entries').set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.Ok);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0]).toHaveProperty('id', '123e4567-e89b-12d3-a456-426614174001');
            expect(response.body.data[0]).toHaveProperty('description', 'Test time entry 1');
            expect(response.body.data[1]).toHaveProperty('id', '123e4567-e89b-12d3-a456-426614174002');
            expect(response.body.data[1]).toHaveProperty('description', 'Test time entry 2');
        });
    });

    describe('POST /', () => {
        it('should create a new time entry', async () => {
            const mockTimeEntry: TimeEntry = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                userId: '123e4567-e89b-12d3-a456-426614174000',
                description: 'Test time entry',
                startTime: '2023-12-01T12:00:00Z',
                endTime: '2023-12-01T13:00:00Z',
                createdAt: '2023-12-01T12:00:00Z',
                updatedAt: '2023-12-01T12:00:00Z',
            };

            jest.mocked(TimeEntryService.prototype.createTimeEntry).mockResolvedValue(mockTimeEntry);

            const response = await request(app).post('/api/time-entries').send({
                userId: '123e4567-e89b-12d3-a456-426614174000',
                description: 'Test time entry',
                startTime: '2023-12-01T12:00:00Z',
                endTime: '2023-12-01T13:00:00Z',
            });

            expect(response.statusCode).toBe(201);
            expect(response.body.data).toHaveProperty('id', mockTimeEntry.id);
            expect(response.body.data).toHaveProperty('userId', '123e4567-e89b-12d3-a456-426614174000');
            expect(response.body.data).toHaveProperty('description', 'Test time entry');
            expect(response.body.data).toHaveProperty('startTime', '2023-12-01T12:00:00Z');
            expect(response.body.data).toHaveProperty('endTime', '2023-12-01T13:00:00Z');
        });

        it('should validate required fields', async () => {
            const response = await request(app).post('/api/time-entries').send({
                userId: '123',
                startTime: '2023-01-01T00:00:00',
            });

            expect(response.statusCode).toBe(HttpCode.BadRequest);
            expect(response.body.error.code).toBe(ErrorCode.BadRequest);
        });

        it('should handle database errors', async () => {
            jest.mocked(TimeEntryService.prototype.createTimeEntry).mockRejectedValue(new Error());

            const response = await request(app).post('/api/time-entries').send({
                userId: '123',
                description: 'Test entry',
                startTime: '2023-01-01T00:00:00',
                endTime: '2023-01-01T01:00:00',
            });

            expect(response.statusCode).toBe(HttpCode.InternalServerError);
            expect(response.body.error.code).toBe(ErrorCode.InternalServerError);
        });
    });

    describe('PUT /:id/stop', () => {
        it('should stop a time entry', async () => {
            jest.mocked(TimeEntryService.prototype.stopTimeEntry).mockResolvedValue();

            const response = await request(app)
                .put(`/api/time-entries/${mockTimeEntryId}/stop`)
                .send({ endTime: '2023-12-01T13:00:00Z' })
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.Ok);
            expect(response.body.success).toBe(true);
        });

        it('should return 404 if time entry is not found', async () => {
            jest.mocked(TimeEntryService.prototype.stopTimeEntry).mockRejectedValue(
                new HttpException(HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry not found')
            );

            const response = await request(app)
                .put(`/api/time-entries/${mockTimeEntryId}/stop`)
                .send({ endTime: '2023-12-01T13:00:00Z' })
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.NotFound);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.TimeEntryNotFound);
            expect(response.body.error).toHaveProperty('message', 'Time entry not found');
        });

        it('should return 500 if there is a server error', async () => {
            jest.mocked(TimeEntryService.prototype.stopTimeEntry).mockRejectedValue(new Error('Server error'));

            const response = await request(app)
                .put(`/api/time-entries/${mockTimeEntryId}/stop`)
                .send({ endTime: '2023-12-01T13:00:00Z' })
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.InternalServerError);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.InternalServerError);
            expect(response.body.error).toHaveProperty('message', 'An error occurred while processing your request.');
        });
    });

    describe('DELETE /:id', () => {
        it('should delete a time entry', async () => {
            jest.mocked(TimeEntryService.prototype.deleteTimeEntry).mockResolvedValue(true);

            const response = await request(app)
                .delete(`/api/time-entries/${mockTimeEntryId}`)
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.Ok);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('message', 'Time entry deleted successfully');
        });

        it('should return 404 if time entry not found', async () => {
            jest.mocked(TimeEntryService.prototype.deleteTimeEntry).mockResolvedValue(false);

            const response = await request(app)
                .delete(`/api/time-entries/${mockTimeEntryId}`)
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.NotFound);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.TimeEntryNotFound);
        });

        it('should return 400 for invalid UUID format', async () => {
            const response = await request(app)
                .delete('/api/time-entries/invalid-id')
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.BadRequest);
            expect(response.body.error.details[0].msg).toBe('ID must be a valid UUID');
        });

        it('should return 500 on server error', async () => {
            jest.mocked(TimeEntryService.prototype.deleteTimeEntry).mockRejectedValue(new Error());

            const response = await request(app)
                .delete(`/api/time-entries/${mockTimeEntryId}`)
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.InternalServerError);
            expect(response.body.error.code).toBe(ErrorCode.InternalServerError);
        });
    });
});
