import { NextFunction, Request, Response } from 'express';
import { ErrorBody, HttpException } from '@interfaces/response-models';
import { ErrorCode } from '@interfaces/error-code';
import HttpCode from '@interfaces/http-code';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(error: Error | HttpException, req: Request, res: Response, next: NextFunction) {
    if (error instanceof HttpException) {
        const { message, httpCode, errorCode, details } = error;
        const errorBody = new ErrorBody(errorCode, message, details);
        res.status(httpCode).json(errorBody);
        return;
    }

    const errorResponse = new ErrorBody(
        ErrorCode.InternalServerError,
        'An error occurred while processing your request.'
    );
    res.status(HttpCode.InternalServerError).json(errorResponse);
}

export default errorHandler;
