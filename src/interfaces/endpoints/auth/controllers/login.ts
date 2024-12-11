import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '@app/config';
import HttpCode from '@interfaces/http-code';
import UserRepository from '@infrastructure/repositories/user';
import dbPool from '@infrastructure/database/connection';
import { ApiError, ApiSuccess } from '@interfaces/response-models';
import { User } from '@entities/user/types';

interface LoginRequestBody {
  email: string;
  password: string;
}

enum ErrorCode {
  BadRequest = 'BAD_REQUEST',
  UserNotFound = 'USER_NOT_FOUND',
  InvalidPassword = 'INVALID_PASSWORD',
}

enum ErrorMessage {
  EmailAndPasswordRequired = 'Email and password are required.',
  UserNotFound = 'User not found.',
  InvalidPassword = 'Invalid password.',
  ServerErrorMessage = 'An error occurred while processing your request.',
}

const userRepository = new UserRepository(dbPool);

async function loginController(req: Request<unknown, unknown, LoginRequestBody>, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    const missingFieldsError = new ApiError(ErrorCode.BadRequest, ErrorMessage.EmailAndPasswordRequired);

    res.status(HttpCode.BadRequest).json(missingFieldsError);
    return;
  }

  let user: User | null;

  try {
    user = await userRepository.getByEmail(email);
  } catch (error) {
    console.error('Error retrieving user:', error);

    const serverError = new ApiError(ErrorCode.BadRequest, ErrorMessage.ServerErrorMessage);

    res.status(HttpCode.InternalServerError).json(serverError);
    return;
  }

  if (!user) {
    const userNotFoundError = new ApiError(ErrorCode.UserNotFound, ErrorMessage.UserNotFound);

    res.status(HttpCode.BadRequest).json(userNotFoundError);
    return;
  }

  let isMatch: boolean;

  try {
    isMatch = await bcrypt.compare(password, user.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);

    const serverError = new ApiError(ErrorCode.BadRequest, ErrorMessage.ServerErrorMessage);
    res.status(HttpCode.InternalServerError).json(serverError);
    return;
  }

  if (!isMatch) {
    const invalidPasswordError = new ApiError(ErrorCode.InvalidPassword, ErrorMessage.InvalidPassword);

    res.status(HttpCode.Forbidden).json(invalidPasswordError);
    return;
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
    },
    config.auth.jwtSecret,
    { expiresIn: config.auth.jwtExpiresIn }
  );
  const successResponse = new ApiSuccess({ token });

  res.json(successResponse);
}

export default loginController;
