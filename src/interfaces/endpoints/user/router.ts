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
 *     summary: Получение информации о текущем пользователе
 *     description: Возвращает детальную информацию о текущем пользователе, основываясь на переданном токене авторизации.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя успешно получены.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: Пользователь не найден.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.get('/me', authenticateToken, userController.getMe.bind(userController));

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Обновление информации о пользователе
 *     description: Обновляет данные текущего пользователя (имя и email). Требуется передать токен авторизации.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Полное имя пользователя.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя.
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Данные пользователя успешно обновлены.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Ошибка валидации или неверные данные.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Пользователь не найден.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
usersRouter.put(
    '/me',
    authenticateToken,
    updateUserValidationRules,
    validateRequest,
    userController.update.bind(userController)
);

export default usersRouter;
