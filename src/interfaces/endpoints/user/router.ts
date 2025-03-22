import { Router } from 'express';
import { authenticateToken } from '@interfaces/middlewares/authenticate-token';
import UserController from '@interfaces/endpoints/user/controller';
import { updateUserValidationRules } from '@interfaces/endpoints/user/validation';
import validateRequest from '@interfaces/middlewares/validate-request';

const usersRouter = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user info
 *     description: Returns detailed information about the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               userNotFound:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: USER_NOT_FOUND
 *                     message: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               serverError:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: INTERNAL_SERVER_ERROR
 *                     message: Internal server error
 */
usersRouter.get('/me', authenticateToken, userController.getMe.bind(userController));

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update current user information
 *     description: Updates name and email of the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validationError:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: BAD_REQUEST
 *                     message: Validation failed
 *                     details: [{"msg":"Invalid email","param":"email"}]
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               userNotFound:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: USER_NOT_FOUND
 *                     message: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               serverError:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: INTERNAL_SERVER_ERROR
 *                     message: Internal server error
 */
usersRouter.put(
    '/me',
    authenticateToken,
    updateUserValidationRules,
    validateRequest,
    userController.update.bind(userController)
);

export default usersRouter;
