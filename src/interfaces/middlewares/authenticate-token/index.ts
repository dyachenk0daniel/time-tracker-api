import { NextFunction, Request, Response } from 'express';
import HttpCode from '@interfaces/http-code';
import { ErrorBody } from '@interfaces/response-models';
import { ErrorCode } from '@interfaces/error-code';
import UserService from '@entities/user/service';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            const missingAuthHeaderError = new ErrorBody(
                ErrorCode.AuthorizationHeaderMissing,
                'Authorization header is missing.'
            );
            res.status(HttpCode.BadRequest).json(missingAuthHeaderError);
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = UserService.verifyToken(token);
        req.body.userId = decoded.id;

        next();
    } catch (error) {
        console.error(error);
        const invalidOrExpiredTokenError = new ErrorBody(ErrorCode.InvalidOrExpiredToken, 'Invalid or expired token.');
        res.status(HttpCode.Unauthorized).json(invalidOrExpiredTokenError);
    }
}
