import { Response } from 'express';
import { ResponseBody } from '@interfaces/response-models';
import HttpCode from '@interfaces/http-code';

abstract class RequestHandler {
    protected sendResponse<T>(res: Response, data: T, httpCode: HttpCode = HttpCode.Ok) {
        const response = new ResponseBody<T>(data);
        res.status(httpCode).json(response);
    }
}

export default RequestHandler;
