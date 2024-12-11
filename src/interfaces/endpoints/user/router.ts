import { Router } from 'express';
import { authenticateToken } from '@interfaces/middlewares/authenticate-token';
import getMeController from './controllers/get-me';

const usersRouter = Router();

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
 *                       type: number
 *                       description: The user's ID.
 *                       example: 123
 *                     name:
 *                       type: string
 *                       description: The user's full name.
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       description: The user's email address.
 *                       example: john.doe@example.com
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
 *                       example: TOKEN_NOT_PROVIDED
 *                     message:
 *                       type: string
 *                       example: Token not provided.
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
 *                       example: INVALID_TOKEN
 *                     message:
 *                       type: string
 *                       example: Invalid token.
 *       500:
 *         description: Server error
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
 *                       example: SERVER_ERROR
 *                     message:
 *                       type: string
 *                       example: An error occurred while processing your request.
 */
usersRouter.get('/me', authenticateToken, getMeController);

export default usersRouter;
