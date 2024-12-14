import { Request, Response } from 'express';
import { ErrorResponse, SuccessResponse } from '@interfaces/response-models';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import sendInternalServerError from '@interfaces/utils/send-internal-server-error';
import UserService from '@entities/user/service';
import { ObjectUtils } from '@shared/utils';
import { LoginRequestBody, RegisterRequestBody } from './types';

class AuthController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(req: Request<unknown, unknown, LoginRequestBody>, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        const missingFieldsError = new ErrorResponse(ErrorCode.BadRequest, 'Email and password are required.');
        res.status(HttpCode.BadRequest).json(missingFieldsError);
        return;
      }

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        const userNotFoundError = new ErrorResponse(ErrorCode.UserNotFound, 'User not found.');
        res.status(HttpCode.BadRequest).json(userNotFoundError);
        return;
      }

      const isMatch = await UserService.comparePasswords(password, user.password);

      if (!isMatch) {
        const invalidPasswordError = new ErrorResponse(ErrorCode.InvalidPassword, 'Invalid password.');
        res.status(HttpCode.Forbidden).json(invalidPasswordError);
        return;
      }

      const token = UserService.generateToken(user);
      const successResponse = new SuccessResponse({ token });
      res.json(successResponse);
    } catch (error) {
      console.error('Error during login:', error);
      sendInternalServerError(res);
    }
  }

  async register(req: Request<unknown, unknown, RegisterRequestBody>, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        const missingFieldsError = new ErrorResponse(ErrorCode.FieldsMissing, 'All fields are required.');
        res.status(HttpCode.BadRequest).json(missingFieldsError);
        return;
      }

      const existingUser = await this.userService.getUserByEmail(email);

      if (existingUser) {
        const userAlreadyExistsError = new ErrorResponse(ErrorCode.UserAlreadyExists, 'A user with this email already exists.');
        res.status(HttpCode.Conflict).json(userAlreadyExistsError);
        return;
      }

      const newUser = await this.userService.createUser(name, email, password);
      const successResponse = new SuccessResponse(ObjectUtils.omit(newUser, ['password']));
      res.status(HttpCode.Created).json(successResponse);
    } catch (error) {
      console.error('Error registering user:', error);
      sendInternalServerError(res);
    }
  }
}

export default AuthController;
