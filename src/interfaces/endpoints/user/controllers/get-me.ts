import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '@app/config';
import UserRepository from '@infrastructure/repositories/user';
import dbPool from '@infrastructure/database/connection';
import HttpCode from '@interfaces/http-code';
import { User } from '@entities/user/types';
import { ApiError, ApiSuccess } from '@interfaces/response-models';
import { omit } from '@shared/utils';

const userRepository = new UserRepository(dbPool);

enum ErrorCode {
  TokenNotProvided = 'TOKEN_NOT_PROVIDED',
  UserNotFound = 'USER_NOT_FOUND',
  InvalidToken = 'INVALID_TOKEN',
}

enum ErrorMessage {
  TokenNotProvided = 'Token not provided.',
  UserNotFound = 'User not found.',
  InvalidToken = 'Invalid token.',
}

const getMeController = async (req: Request, res: Response) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    const missingTokenError = new ApiError(ErrorCode.TokenNotProvided, ErrorMessage.TokenNotProvided);

    res.status(HttpCode.NotFound).json(missingTokenError);
    return;
  }

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret) as { id: number };
    const user = await userRepository.getById(decoded.id);

    if (!user) {
      const userNotFoundError = new ApiError(ErrorCode.UserNotFound, ErrorMessage.UserNotFound);

      res.status(HttpCode.NotFound).json(userNotFoundError);
      return;
    }

    const successResponse = new ApiSuccess<Omit<User, 'password'>>(omit(user, ['password']));

    res.json(successResponse);
  } catch (error) {
    console.log(error);

    const invalidTokenError = new ApiError(ErrorCode.InvalidToken, ErrorMessage.InvalidToken);

    res.status(HttpCode.Unauthorized).json(invalidTokenError);
  }
};

export default getMeController;
