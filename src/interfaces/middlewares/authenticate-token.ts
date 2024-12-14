import { NextFunction, Request, Response } from 'express';
import HttpCode from '@interfaces/http-code';
import { ErrorResponse } from '@interfaces/response-models';
import { ErrorCode } from '@interfaces/error-code';
import UserService from '@entities/user/service';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const missingAuthHeaderError = new ErrorResponse(ErrorCode.AuthorizationHeaderMissing, 'Authorization header is missing.');
      res.status(HttpCode.NotFound).json(missingAuthHeaderError);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = UserService.validateToken(token);
    req.body.userId = decoded.id;

    next();
  } catch (error) {
    console.error(error);
    const invalidOrExpiredTokenError = new ErrorResponse(ErrorCode.InvalidOrExpiredToken, 'Invalid or expired token.');
    res.status(HttpCode.Unauthorized).json(invalidOrExpiredTokenError);
  }
}
