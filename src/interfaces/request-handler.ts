import { Response } from 'express';
import { ErrorBody, ResponseBody } from '@interfaces/response-models';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';

abstract class RequestHandler {
    protected sendResponse<T>(res: Response, data: T, httpCode: HttpCode = HttpCode.Ok) {
        const response = new ResponseBody<T>(data);
        res.status(httpCode).json(response);
    }

    protected sendError(res: Response, httpCode: HttpCode, errorCode: ErrorCode, message: string) {
        const errorResponse = new ErrorBody(errorCode, message);
        res.status(httpCode).json(errorResponse);
    }

    protected sendInternalError(
        res: Response,
        httpCode = HttpCode.InternalServerError,
        message = 'An error occurred while processing your request.'
    ) {
        const errorResponse = new ErrorBody(ErrorCode.InternalServerError, message);
        res.status(httpCode).json(errorResponse);
    }
}

export default RequestHandler;
