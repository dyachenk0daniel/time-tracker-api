import 'module-alias/register';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import logger from '@app/middlware/logger';
import apiRouter from '@interfaces/api-router';
import errorHandler from '@interfaces/middlewares/error-handler';
import config from './config';
import { setupSwagger } from './swagger';

const { host, port, apiPath } = config.server;
const app = express();

setupSwagger(app);

app.use(helmet());
app.use(cors());
app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
});
app.use(limiter);

app.use(logger);
app.use(express.json());
app.use(apiPath, apiRouter);
app.use(errorHandler);

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
    console.log(`Swagger docs available at http://${host}:${port}/api-docs`);
});
