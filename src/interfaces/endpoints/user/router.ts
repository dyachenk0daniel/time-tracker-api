import { Router } from 'express';
import { authenticateToken } from '@interfaces/middlewares/authenticate-token';
import UserController from '@interfaces/endpoints/user/controller';

const usersRouter = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user information
 *     description: Returns information about the currently authenticated user based on the provided JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
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
 *                     id:
 *                       type: string
 *                       description: The user's ID.
 *                       example: "b3b9d6da-4383-4fc7-8dc3-c7d8e20c9b59"
 *                     name:
 *                       type: string
 *                       description: The user's full name.
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       description: The user's email address.
 *                       example: john.doe@example.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the user was created.
 *                       example: "2023-12-01T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the user was last updated, or null if not updated.
 *                       example: "2023-12-15T14:30:00Z"
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: INVALID_OR_EXPIRED_TOKEN
 *                     message:
 *                       type: string
 *                       example: Invalid or expired token.
 *       400:
 *         description: Token not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: AUTHORIZATION_HEADER_MISSING
 *                     message:
 *                       type: string
 *                       example: Authorization header is missing.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: INTERNAL_SERVER_ERROR
 *                     message:
 *                       type: string
 *                       example: An error occurred while processing your request.
 */
usersRouter.get('/me', authenticateToken, userController.getMe.bind(userController));

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update current user information
 *     description: Updates the information of the currently authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the user.
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 description: The new email of the user.
 *                 example: jane.doe@example.com
 *     responses:
 *       200:
 *         description: Successfully updated user data
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
 *                     id:
 *                       type: string
 *                       description: The user's ID.
 *                       example: "b3b9d6da-4383-4fc7-8dc3-c7d8e20c9b59"
 *                     name:
 *                       type: string
 *                       description: The user's updated full name.
 *                       example: Jane Doe
 *                     email:
 *                       type: string
 *                       description: The user's updated email address.
 *                       example: jane.doe@example.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the user was created.
 *                       example: "2023-12-01T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the user was last updated, or null if not updated.
 *                       example: "2023-12-15T14:30:00Z"
 *       400:
 *         description: Token not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: AUTHORIZATION_HEADER_MISSING
 *                     message:
 *                       type: string
 *                       example: Authorization header is missing.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: USER_NOT_FOUND
 *                     message:
 *                       type: string
 *                       example: User not found.
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: INVALID_OR_EXPIRED_TOKEN
 *                     message:
 *                       type: string
 *                       example: Invalid or expired token.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: INTERNAL_SERVER_ERROR
 *                     message:
 *                       type: string
 *                       example: An error occurred while processing your request.
 */
usersRouter.put('/me', authenticateToken, userController.update.bind(userController));

export default usersRouter;
