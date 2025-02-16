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

const timeEntryRouter = Router();
const timeEntryController = new TimeEntryController();

/**
 * @swagger
 * /api/time-entries:
 *   get:
 *     summary: Получение списка записей времени
 *     description: Возвращает список всех записей времени, связанных с текущим аутентифицированным пользователем.
 *     tags:
 *       - Time Entry
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список записей времени успешно получен.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TimeEntryResponse'
 *       401:
 *         description: Неавторизованный доступ (недействительный или отсутствующий токен)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
timeEntryRouter.get('/', authenticateToken, timeEntryController.getTimeEntries.bind(timeEntryController));

/**
 * @swagger
 * /api/time-entries/{id}:
 *   get:
 *     summary: Получение записи времени по ID
 *     description: Возвращает детальную информацию о записи времени по её идентификатору.
 *     tags:
 *       - Time Entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Идентификатор записи времени (UUID).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Запись времени успешно получена.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeEntryResponse'
 *       400:
 *         description: Ошибка валидации параметров запроса.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Неавторизованный доступ.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Запись времени не найдена.
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
 *     summary: Создание новой записи времени
 *     description: Создает новую запись времени для текущего пользователя, принимая данные о проекте, затраченном времени и описании.
 *     tags:
 *       - Time Entry
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TimeEntryCreateRequest'
 *     responses:
 *       201:
 *         description: Запись времени успешно создана.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeEntryResponse'
 *       400:
 *         description: Неверные данные запроса.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Неавторизованный доступ.
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
 *     summary: Остановка записи времени
 *     description: Завершает запись времени, устанавливая время окончания записи для указанного идентификатора.
 *     tags:
 *       - Time Entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Идентификатор записи времени (UUID).
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - endTime
 *             properties:
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Время окончания записи в формате ISO 8601.
 *                 example: "2023-10-01T17:00:00Z"
 *     responses:
 *       200:
 *         description: Запись времени успешно обновлена (остановлена).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeEntryResponse'
 *       400:
 *         description: Ошибка валидации или неверные данные.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Неавторизованный доступ.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Запись времени не найдена.
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
 *     summary: Удаление записи времени
 *     description: Удаляет запись времени по её идентификатору.
 *     tags:
 *       - Time Entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Идентификатор записи времени (UUID).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Запись времени успешно удалена.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Time entry deleted successfully"
 *       401:
 *         description: Неавторизованный доступ.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Запись времени не найдена.
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
timeEntryRouter.delete(
    '/:id',
    authenticateToken,
    deleteTimeEntryValidationRules,
    validateRequest,
    timeEntryController.deleteTimeEntry.bind(timeEntryController)
);

export default timeEntryRouter;
