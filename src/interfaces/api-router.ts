import { Router } from 'express';
import usersRouter from '@interfaces/endpoints/user/router';
import authRouter from '@interfaces/endpoints/auth/router';
import timeEntryRouter from '@interfaces/endpoints/time-entry/router';

enum ApiPaths {
  Users = '/users',
  Auth = '/auth',
  TimeEntry = '/time-entries'
}

const apiRouter = Router();

apiRouter
    .use(ApiPaths.Users, usersRouter)
    .use(ApiPaths.Auth, authRouter)
    .use(ApiPaths.TimeEntry, timeEntryRouter);

export default apiRouter;
