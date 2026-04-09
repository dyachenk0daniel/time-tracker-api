import { Express } from 'express';
import request from 'supertest';
import timeEntryRouter from './router';
import { authenticateToken } from '@interfaces/middlewares/authenticate-token';
import TimeEntryService from '@entities/time-entry/service';
import { TimeEntry, TimeEntryGroup } from '@entities/time-entry/types';
import { TestUtils } from '@shared/utils';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import { HttpException } from '@interfaces/response-models';

jest.mock('@interfaces/middlewares/authenticate-token');
jest.mock('@entities/time-entry/service');
jest.mock('ioredis');

describe('timeEntryRouter', () => {
    let app: Express;
    const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
    const mockGroupId = '123e4567-e89b-12d3-a456-426614174999';
    const mockTimeEntryId = '123e4567-e89b-12d3-a456-426614174000';

    beforeAll(() => {
        app = TestUtils.createApp(timeEntryRouter, '/api/time-entries');
        jest.mocked(authenticateToken).mockImplementation((req, res, next) => {
            req.body.userId = mockUserId;
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
                groupId: mockGroupId,
                description: 'Test time entry',
                startTime: '2023-12-01T12:00:00Z',
                endTime: '2023-12-01T13:00:00Z',
            };

            jest.mocked(TimeEntryService.prototype.getTimeEntryById).mockResolvedValue(mockTimeEntry);

            const response = await request(app)
                .get(`/api/time-entries/${mockTimeEntryId}`)
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.Ok);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id', mockTimeEntryId);
            expect(response.body.data).toHaveProperty('groupId', mockGroupId);
            expect(response.body.data).toHaveProperty('startTime', '2023-12-01T12:00:00Z');
            expect(response.body.data).toHaveProperty('endTime', '2023-12-01T13:00:00Z');
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
        const mockGroups: TimeEntryGroup[] = [
            {
                id: '123e4567-e89b-12d3-a456-426614174001',
                userId: mockUserId,
                description: 'Test group 1',
                entriesCount: 2,
                startTime: '2023-12-01T09:00:00Z',
                endTime: '2023-12-01T12:00:00Z',
                entry: null,
            },
            {
                id: '123e4567-e89b-12d3-a456-426614174002',
                userId: mockUserId,
                description: 'Test group 2',
                entriesCount: 1,
                startTime: '2023-12-02T12:00:00Z',
                endTime: null,
                entry: {
                    id: '123e4567-e89b-12d3-a456-426614174010',
                    groupId: '123e4567-e89b-12d3-a456-426614174002',
                    description: 'Test group 2',
                    startTime: '2023-12-02T12:00:00Z',
                    endTime: null,
                },
            },
        ];

        it('should return paginated time entry groups with default page and limit', async () => {
            jest.mocked(TimeEntryService.prototype.getAllTimeEntryGroups).mockResolvedValue({
                items: mockGroups,
                total: 2,
                page: 1,
                limit: 10,
            });

            const response = await request(app).get('/api/time-entries').set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.Ok);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('total', 2);
            expect(response.body.data).toHaveProperty('page', 1);
            expect(response.body.data).toHaveProperty('limit', 10);
            expect(response.body.data.items).toHaveLength(2);
            expect(response.body.data.items[0]).toHaveProperty('id', '123e4567-e89b-12d3-a456-426614174001');
            expect(response.body.data.items[0]).toHaveProperty('description', 'Test group 1');
            expect(response.body.data.items[1]).toHaveProperty('id', '123e4567-e89b-12d3-a456-426614174002');
            expect(response.body.data.items[1]).toHaveProperty('description', 'Test group 2');
            expect(TimeEntryService.prototype.getAllTimeEntryGroups).toHaveBeenCalledWith(mockUserId, 1, 10);
        });

        it('should pass custom page and limit to the service', async () => {
            jest.mocked(TimeEntryService.prototype.getAllTimeEntryGroups).mockResolvedValue({
                items: mockGroups,
                total: 42,
                page: 3,
                limit: 5,
            });

            const response = await request(app)
                .get('/api/time-entries?page=3&limit=5')
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.Ok);
            expect(response.body.data).toHaveProperty('total', 42);
            expect(response.body.data).toHaveProperty('page', 3);
            expect(response.body.data).toHaveProperty('limit', 5);
            expect(TimeEntryService.prototype.getAllTimeEntryGroups).toHaveBeenCalledWith(mockUserId, 3, 5);
        });

        it('should return 400 if page is not a positive integer', async () => {
            const response = await request(app)
                .get('/api/time-entries?page=0')
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.BadRequest);
            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe(ErrorCode.BadRequest);
            expect(response.body.error.details[0].msg).toBe('Page must be a positive integer');
        });

        it('should return 400 if limit exceeds maximum', async () => {
            const response = await request(app)
                .get('/api/time-entries?limit=101')
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.BadRequest);
            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe(ErrorCode.BadRequest);
            expect(response.body.error.details[0].msg).toBe('Limit must be an integer between 1 and 100');
        });

        it('should return 500 if there is a server error', async () => {
            jest.mocked(TimeEntryService.prototype.getAllTimeEntryGroups).mockRejectedValue(new Error('Server error'));

            const response = await request(app).get('/api/time-entries').set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.InternalServerError);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.InternalServerError);
        });
    });

    describe('POST /', () => {
        it('should create a new time entry', async () => {
            const mockTimeEntry: TimeEntry = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                groupId: mockGroupId,
                description: 'Test time entry',
                startTime: '2023-12-01T12:00:00Z',
                endTime: null,
            };

            jest.mocked(TimeEntryService.prototype.createTimeEntry).mockResolvedValue(mockTimeEntry);

            const response = await request(app).post('/api/time-entries').send({
                description: 'Test time entry',
            });

            expect(response.statusCode).toBe(201);
            expect(response.body.data).toHaveProperty('id', mockTimeEntry.id);
            expect(response.body.data).toHaveProperty('groupId', mockGroupId);
            expect(response.body.data).toHaveProperty('startTime', '2023-12-01T12:00:00Z');
            expect(response.body.data).toHaveProperty('endTime', null);
        });

        it('should validate required fields', async () => {
            const response = await request(app).post('/api/time-entries').send({});

            expect(response.statusCode).toBe(HttpCode.BadRequest);
            expect(response.body.error.code).toBe(ErrorCode.BadRequest);
        });

        it('should handle database errors', async () => {
            jest.mocked(TimeEntryService.prototype.createTimeEntry).mockRejectedValue(new Error());

            const response = await request(app).post('/api/time-entries').send({
                description: 'Test entry',
            });

            expect(response.statusCode).toBe(HttpCode.InternalServerError);
            expect(response.body.error.code).toBe(ErrorCode.InternalServerError);
        });
    });

    describe('PUT /:id/stop', () => {
        it('should stop a time entry and return updated entry', async () => {
            const mockTimeEntry: TimeEntry = {
                id: mockTimeEntryId,
                groupId: mockGroupId,
                description: 'Test time entry',
                startTime: '2023-12-01T12:00:00Z',
                endTime: '2023-12-01T13:00:00Z',
            };

            jest.mocked(TimeEntryService.prototype.stopTimeEntry).mockResolvedValue(mockTimeEntry);

            const response = await request(app)
                .put(`/api/time-entries/${mockTimeEntryId}/stop`)
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.Ok);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id', mockTimeEntryId);
            expect(response.body.data).toHaveProperty('groupId', mockGroupId);
            expect(response.body.data).toHaveProperty('startTime', '2023-12-01T12:00:00Z');
            expect(response.body.data).toHaveProperty('endTime', '2023-12-01T13:00:00Z');
        });

        it('should return 404 if time entry is not found', async () => {
            jest.mocked(TimeEntryService.prototype.stopTimeEntry).mockRejectedValue(
                new HttpException(HttpCode.NotFound, ErrorCode.TimeEntryNotFound, 'Time entry not found')
            );

            const response = await request(app)
                .put(`/api/time-entries/${mockTimeEntryId}/stop`)
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.NotFound);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.TimeEntryNotFound);
            expect(response.body.error).toHaveProperty('message', 'Time entry not found');
        });

        it('should return 409 if time entry is already stopped', async () => {
            jest.mocked(TimeEntryService.prototype.stopTimeEntry).mockRejectedValue(
                new HttpException(
                    HttpCode.BadRequest,
                    ErrorCode.TimeEntryAlreadyStopped,
                    'Time entry is already stopped'
                )
            );

            const response = await request(app)
                .put(`/api/time-entries/${mockTimeEntryId}/stop`)
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.BadRequest);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.TimeEntryAlreadyStopped);
            expect(response.body.error).toHaveProperty('message', 'Time entry is already stopped');
        });

        it('should return 400 for invalid UUID format', async () => {
            const response = await request(app)
                .put('/api/time-entries/invalid-id/stop')
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.BadRequest);
            expect(response.body.success).toBe(false);
            expect(response.body.error.details[0].msg).toBe('ID must be a valid UUID');
        });

        it('should return 500 if there is a server error', async () => {
            jest.mocked(TimeEntryService.prototype.stopTimeEntry).mockRejectedValue(new Error('Server error'));

            const response = await request(app)
                .put(`/api/time-entries/${mockTimeEntryId}/stop`)
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

    describe('GET /active', () => {
        it('should return the active time entry', async () => {
            const mockActiveTimeEntry: TimeEntry = {
                id: mockTimeEntryId,
                groupId: mockGroupId,
                description: 'Active task',
                startTime: '2023-12-01T12:00:00Z',
                endTime: null,
            };

            jest.mocked(TimeEntryService.prototype.getActiveTimeEntry).mockResolvedValue(mockActiveTimeEntry);

            const response = await request(app)
                .get('/api/time-entries/active')
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.Ok);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id', mockTimeEntryId);
            expect(response.body.data).toHaveProperty('groupId', mockGroupId);
            expect(response.body.data).toHaveProperty('endTime', null);
        });

        it('should return null if no active time entry exists', async () => {
            jest.mocked(TimeEntryService.prototype.getActiveTimeEntry).mockResolvedValue(null);

            const response = await request(app)
                .get('/api/time-entries/active')
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.Ok);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeNull();
        });

        it('should return 500 if there is a server error', async () => {
            jest.mocked(TimeEntryService.prototype.getActiveTimeEntry).mockRejectedValue(new Error('Server error'));

            const response = await request(app)
                .get('/api/time-entries/active')
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.InternalServerError);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.InternalServerError);
        });
    });

    describe('GET /:groupId/entries', () => {
        const mockEntries: TimeEntry[] = [
            {
                id: '123e4567-e89b-12d3-a456-426614174010',
                groupId: mockGroupId,
                description: 'Entry 1',
                startTime: '2023-12-01T09:00:00Z',
                endTime: '2023-12-01T10:00:00Z',
            },
            {
                id: '123e4567-e89b-12d3-a456-426614174011',
                groupId: mockGroupId,
                description: 'Entry 2',
                startTime: '2023-12-01T11:00:00Z',
                endTime: null,
            },
        ];

        it('should return paginated entries for a group', async () => {
            jest.mocked(TimeEntryService.prototype.getEntriesByGroupId).mockResolvedValue({
                items: mockEntries,
                total: 2,
                page: 1,
                limit: 10,
            });

            const response = await request(app)
                .get(`/api/time-entries/${mockGroupId}/entries`)
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.Ok);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('total', 2);
            expect(response.body.data).toHaveProperty('page', 1);
            expect(response.body.data).toHaveProperty('limit', 10);
            expect(response.body.data.items).toHaveLength(2);
            expect(TimeEntryService.prototype.getEntriesByGroupId).toHaveBeenCalledWith(mockGroupId, mockUserId, 1, 10);
        });

        it('should return 404 if group not found', async () => {
            jest.mocked(TimeEntryService.prototype.getEntriesByGroupId).mockResolvedValue(null);

            const response = await request(app)
                .get(`/api/time-entries/${mockGroupId}/entries`)
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.NotFound);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toHaveProperty('code', ErrorCode.TimeEntryNotFound);
        });

        it('should return 400 for invalid group UUID', async () => {
            const response = await request(app)
                .get('/api/time-entries/invalid-id/entries')
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.BadRequest);
            expect(response.body.error.details[0].msg).toBe('Group ID must be a valid UUID');
        });

        it('should return 500 on server error', async () => {
            jest.mocked(TimeEntryService.prototype.getEntriesByGroupId).mockRejectedValue(new Error('Server error'));

            const response = await request(app)
                .get(`/api/time-entries/${mockGroupId}/entries`)
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(HttpCode.InternalServerError);
            expect(response.body.error).toHaveProperty('code', ErrorCode.InternalServerError);
        });
    });
});