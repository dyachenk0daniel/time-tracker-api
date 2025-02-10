import { ValidationError } from 'express-validator';

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
