import { Router } from 'express';
import { authenticateToken } from '@interfaces/middlewares/authenticate-token';
import validateRequest from '@interfaces/middlewares/validate-request';
import TimeEntryController from './controller';
import {
    createTimeEntryValidationRules,
    deleteTimeEntryValidationRules,
    getTimeEntryByIdValidationRules,
    stopTimeEntryValidationRules,
} from './validation';
import { PrismaClient } from '@prisma/client';
import TimeEntryService from '@entities/time-entry/service';

const timeEntryRouter = Router();
const prisma = new PrismaClient();
const timeEntryService = new TimeEntryService(prisma);
const timeEntryController = new TimeEntryController(timeEntryService);

/**
 * @swagger
 * /api/time-entries:
 *   get:
 *     summary: Get all time entries
 *     description: Retrieve list of all time entries for authenticated user
 *     tags: [Time Entry]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved time entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TimeEntryResponse'
 *             examples:
 *               activeAndCompleted:
 *                 value:
 *                   - id: "550e8400-e29b-41d4-a716-446655440000"
 *                     userId: "123e4567-e89b-12d3-a456-426614174000"
 *                     description: "Morning coding session"
 *                     startTime: "2023-12-01T09:00:00Z"
 *                     endTime: "2023-12-01T12:00:00Z"
 *                     createdAt: "2023-12-01T08:55:00Z"
 *                     updatedAt: "2023-12-01T12:05:00Z"
 *                   - id: "550e8400-e29b-41d4-a716-446655440001"
 *                     userId: "123e4567-e89b-12d3-a456-426614174000"
 *                     description: "Afternoon meeting"
 *                     startTime: "2023-12-01T14:00:00Z"
 *                     endTime: null
 *                     createdAt: "2023-12-01T13:45:00Z"
 *                     updatedAt: null
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               databaseError:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INTERNAL_SERVER_ERROR"
 *                     message: "Failed to retrieve time entries"
 *                     details: "Database connection timeout"
 */
timeEntryRouter.get('/', authenticateToken, timeEntryController.getTimeEntries.bind(timeEntryController));

/**
 * @swagger
 * /api/time-entries/active:
 *   get:
 *     summary: Get active time entry
 *     description: Retrieve the currently active time entry (with no end time) for the authenticated user
 *     tags: [Time Entry]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved active time entry or null if none exists
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/TimeEntryResponse'
 *                 - type: null
 *             examples:
 *               activeEntry:
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   userId: "123e4567-e89b-12d3-a456-426614174000"
 *                   description: "Current task"
 *                   startTime: "2023-12-01T09:00:00Z"
 *                   endTime: null
 *                   createdAt: "2023-12-01T09:00:00Z"
 *                   updatedAt: null
 *               noActiveEntry:
 *                 value: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
timeEntryRouter.get('/active', authenticateToken, timeEntryController.getActiveTimeEntry.bind(timeEntryController));

/**
 * @swagger
 * /api/time-entries/{id}:
 *   get:
 *     summary: Get time entry by ID
 *     description: Retrieve detailed information about specific time entry
 *     tags: [Time Entry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         examples:
 *           validUUID:
 *             value: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Time entry details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeEntryResponse'
 *             examples:
 *               activeEntry:
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   userId: "123e4567-e89b-12d3-a456-426614174000"
 *                   description: "Code review"
 *                   startTime: "2023-12-01T16:00:00Z"
 *                   endTime: null
 *                   createdAt: "2023-12-01T16:05:00Z"
 *                   updatedAt: null
 *               completedEntry:
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440001"
 *                   userId: "123e4567-e89b-12d3-a456-426614174000"
 *                   description: "Daily standup"
 *                   startTime: "2023-12-01T10:00:00Z"
 *                   endTime: "2023-12-01T10:15:00Z"
 *                   createdAt: "2023-12-01T09:55:00Z"
 *                   updatedAt: "2023-12-01T10:15:30Z"
 *       404:
 *         description: Entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "TIME_ENTRY_NOT_FOUND"
 *                     message: "Time entry with ID 550e8400-e29b-41d4-a716-446655440000 not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
timeEntryRouter.get(
    '/:id',
    authenticateToken,
    getTimeEntryByIdValidationRules,
    validateRequest,
    timeEntryController.getTimeEntryById.bind(timeEntryController)
);

/**
 * @swagger
 * /api/time-entries:
 *   post:
 *     summary: Create new time entry
 *     description: Create a new time tracking record for authenticated user
 *     tags: [Time Entry]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TimeEntryCreateRequest'
 *           examples:
 *             minimalRequest:
 *               value:
 *                 description: "Developed new feature"
 *                 startTime: "2023-12-01T09:00:00Z"
 *             fullRequest:
 *               value:
 *                 description: "Team meeting"
 *                 startTime: "2023-12-01T14:00:00Z"
 *                 endTime: "2023-12-01T15:30:00Z"
 *     responses:
 *       201:
 *         description: Time entry created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeEntryResponse'
 *             examples:
 *               successResponse:
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   userId: "123e4567-e89b-12d3-a456-426614174000"
 *                   description: "Developed new feature"
 *                   startTime: "2023-12-01T09:00:00Z"
 *                   endTime: null
 *                   createdAt: "2023-12-01T09:05:23Z"
 *                   updatedAt: null
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidStartTime:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "BAD_REQUEST"
 *                     message: "Validation failed"
 *                     details:
 *                       - msg: "Invalid ISO 8601 date format"
 *                         param: "startTime"
 *               missingDescription:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "BAD_REQUEST"
 *                     message: "Validation failed"
 *                     details:
 *                       - msg: "Description is required"
 *                         param: "description"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               databaseError:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INTERNAL_SERVER_ERROR"
 *                     message: "Could not save time entry"
 */
timeEntryRouter.post(
    '/',
    authenticateToken,
    createTimeEntryValidationRules,
    validateRequest,
    timeEntryController.createTimeEntry.bind(timeEntryController)
);

/**
 * @swagger
 * /api/time-entries/{id}/stop:
 *   put:
 *     summary: Stop active time entry
 *     description: Mark the current time as the end time for a running time entry
 *     tags: [Time Entry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         examples:
 *           validUUID:
 *             value: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Time entry stopped
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeEntryResponse'
 *             examples:
 *               stoppedEntry:
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   userId: "123e4567-e89b-12d3-a456-426614174000"
 *                   description: "Development work"
 *                   startTime: "2023-12-01T14:00:00Z"
 *                   endTime: "2023-12-01T17:30:00Z"
 *                   createdAt: "2023-12-01T13:55:00Z"
 *                   updatedAt: "2023-12-01T17:30:05Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidId:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "BAD_REQUEST"
 *                     message: "Validation failed"
 *                     details:
 *                       - msg: "ID must be a valid UUID"
 *                         param: "id"
 *       404:
 *         description: Time entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "TIME_ENTRY_NOT_FOUND"
 *                     message: "Time entry not found"
 *       409:
 *         description: Time entry already stopped
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               alreadyStopped:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "TIME_ENTRY_ALREADY_STOPPED"
 *                     message: "Time entry is already stopped"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
timeEntryRouter.put(
    '/:id/stop',
    authenticateToken,
    stopTimeEntryValidationRules,
    validateRequest,
    timeEntryController.stopTimeEntry.bind(timeEntryController)
);

/**
 * @swagger
 * /api/time-entries/{id}:
 *   delete:
 *     summary: Delete time entry
 *     description: Permanently remove specific time entry
 *     tags: [Time Entry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         examples:
 *           validUUID:
 *             value: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Time entry deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Time entry deleted successfully"
 *             examples:
 *               successResponse:
 *                 value:
 *                   success: true
 *                   data:
 *                     message: "Deleted time entry 550e8400-e29b-41d4-a716-446655440000"
 *       404:
 *         description: Entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "TIME_ENTRY_NOT_FOUND"
 *                     message: "Time entry with ID 550e8400-e29b-41d4-a716-446655440000 not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               deletionError:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INTERNAL_SERVER_ERROR"
 *                     message: "Failed to delete time entry"
 *                     details: "Database constraint violation"
 */
timeEntryRouter.delete(
    '/:id',
    authenticateToken,
    deleteTimeEntryValidationRules,
    validateRequest,
    timeEntryController.deleteTimeEntry.bind(timeEntryController)
);

export default timeEntryRouter;
