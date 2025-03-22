import winston from 'winston';
import { NextFunction, Request, Response } from 'express';

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

const logRequest = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`);
    next();
};

export default logRequest;
