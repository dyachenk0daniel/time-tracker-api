import { Router } from 'express';
import usersRouter from './user/router';

enum ApiPaths {
  Users = '/users',
}

const apiRouter = Router();

apiRouter.use(ApiPaths.Users, usersRouter);

export default apiRouter;
