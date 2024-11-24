import 'module-alias/register';
import express, { Request, Response } from 'express';
import apiRouter from '@interfaces/api-router';
import dbInstance from "@infrastructure/database/connection";
import config from './config';

const { port, apiPath } = config.server;

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.use(apiPath, apiRouter);

dbInstance.connect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});