import { Router } from 'express';
import { authenticateToken } from '@interfaces/middlewares/authenticate-token';
import UserController from '@interfaces/endpoints/user/controller';
import { updateUserValidationRules } from '@interfaces/endpoints/user/validation';
import validateRequest from '@interfaces/middlewares/validate-request';

const usersRouter = Router();
const userController = new UserController();

usersRouter.get('/me', authenticateToken, userController.getMe.bind(userController));
usersRouter.put(
    '/me',
    authenticateToken,
    updateUserValidationRules,
    validateRequest,
    userController.update.bind(userController)
);

export default usersRouter;
