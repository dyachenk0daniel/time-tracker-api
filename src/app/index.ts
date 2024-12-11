import 'module-alias/register';
import express from 'express';
import apiRouter from '@interfaces/api-router';
import dbPool from '@infrastructure/database/connection';
import config from './config';
import { setupSwagger } from './swagger';

const { host, port, apiPath } = config.server;
const app = express();

setupSwagger(app);

app.use(express.json());
app.use(apiPath, apiRouter);

dbPool.connect().then(() => {
  app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
    console.log(`Swagger docs available at http://${host}:${port}/api-docs`);
  });
});
