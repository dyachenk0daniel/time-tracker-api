import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '@app/config';
import HttpCode from '@interfaces/http-code';
import { ApiError } from '@interfaces/response-models';

enum ErrorMessage {
  AuthorizationHeaderMissing = 'Authorization header is missing.',
  InvalidOrExpiredToken = 'Invalid or expired token.',
}

enum ErrorCode {
  AuthorizationHeaderMissing = 'AUTHORIZATION_HEADER_MISSING',
  InvalidOrExpiredToken = 'INVALID_OR_EXPIRED_TOKEN',
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const missingAuthHeaderError = new ApiError(ErrorCode.AuthorizationHeaderMissing, ErrorMessage.AuthorizationHeaderMissing);

    res.status(HttpCode.NotFound).json(missingAuthHeaderError);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret) as { userId: number };

    req.body.userId = decoded.userId;

    next();
  } catch (error) {
    console.error(error);

    const invalidOrExpiredTokenError = new ApiError(ErrorCode.InvalidOrExpiredToken, ErrorMessage.InvalidOrExpiredToken);

    res.status(HttpCode.Unauthorized).json(invalidOrExpiredTokenError);
  }
};
