import { ValidationError } from 'express-validator';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';

export type ErrorDetails = string | ValidationError[];

export class ErrorBody {
    success = false as const;
    error: {
        code: string;
        message: string;
        details?: ErrorDetails;
    };

    constructor(code: string, message: string, details?: ErrorDetails) {
        this.error = { code, message, details };
    }
}

export class ResponseBody<T> {
    success = true as const;
    data: T;

    constructor(data: T) {
        this.data = data;
    }
}

export class HttpException extends Error {
    httpCode: HttpCode;
    errorCode: ErrorCode;
    details?: ErrorDetails;

    constructor(httpCode: HttpCode, errorCode: ErrorCode, message: string, details?: ErrorDetails) {
        super(message);
        this.httpCode = httpCode;
        this.errorCode = errorCode;
        this.details = details;
    }
}
