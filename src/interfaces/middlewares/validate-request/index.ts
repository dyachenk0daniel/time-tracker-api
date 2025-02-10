import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ErrorBody } from '@interfaces/response-models';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const validationDetails = errors.array();
        const errorResponse = new ErrorBody(ErrorCode.BadRequest, 'Validation failed', validationDetails);
        res.status(HttpCode.BadRequest).json(errorResponse);
        return;
    }

    next();
};

export default validateRequest;