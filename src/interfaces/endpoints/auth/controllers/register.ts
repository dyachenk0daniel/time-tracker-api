import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import HttpCode from '@interfaces/http-code';
import UserRepository from '@infrastructure/repositories/user';
import dbPool from '@infrastructure/database/connection';
import { omit } from '@shared/utils';
import { ApiError, ApiSuccess } from '@interfaces/response-models';

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

const BCRYPT_SALT_ROUNDS = 10;

const userRepository = new UserRepository(dbPool);

enum ErrorCode {
  FieldsMissing = 'FIELDS_MISSING',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  ServerError = 'SERVER_ERROR',
}

enum ErrorMessage {
  AllFieldsRequired = 'All fields are required.',
  UserExists = 'A user with this email already exists.',
  ServerError = 'Server error.',
}

async function registerController(req: Request<unknown, unknown, RegisterRequestBody>, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const missingFieldsError = new ApiError(ErrorCode.FieldsMissing, ErrorMessage.AllFieldsRequired);

    res.status(HttpCode.BadRequest).json(missingFieldsError);
    return;
  }

  try {
    const existingUser = await userRepository.getByEmail(email);

    if (existingUser) {
      const userAlreadyExistsError = new ApiError(ErrorCode.UserAlreadyExists, ErrorMessage.UserExists);

      res.status(HttpCode.Conflict).json(userAlreadyExistsError);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const newUser = await userRepository.create({
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
    });

    const successResponse = new ApiSuccess(omit(newUser, ['password']));

    res.status(HttpCode.Created).json(successResponse);
  } catch (error) {
    console.error('Error registering user:', error);

    const serverError = new ApiError(ErrorCode.ServerError, ErrorMessage.ServerError);

    res.status(HttpCode.InternalServerError).json(serverError);
  }
}

export default registerController;
