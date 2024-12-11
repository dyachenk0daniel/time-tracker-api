import { Router } from 'express';
import usersRouter from '@interfaces/endpoints/user/router';
import authRouter from '@interfaces/endpoints/auth/router';

enum ApiPaths {
  Users = '/users',
  Auth = '/auth',
}

const apiRouter = Router();

apiRouter.use(ApiPaths.Users, usersRouter).use(ApiPaths.Auth, authRouter);

export default apiRouter;
