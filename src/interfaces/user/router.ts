import { Router } from 'express';
import { getUsersHandler } from './controllers';

const usersRouter = Router();

usersRouter.get('/', getUsersHandler);

export default usersRouter;