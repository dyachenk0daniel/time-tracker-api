import { Request, Response } from 'express';
import { ErrorResponse, SuccessResponse } from '@interfaces/response-models';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import sendInternalServerError from '@interfaces/utils/send-internal-server-error';
import { UserResponse } from '@entities/user/types';
import UserService from '@entities/user/service';
import { UserModel } from '@entities/user/model';

class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getMe(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const user = await this.userService.getUserById(userId);

      if (!user) {
        const userNotFoundError = new ErrorResponse(ErrorCode.UserNotFound, 'User not found.');
        res.status(HttpCode.NotFound).json(userNotFoundError);
        return;
      }

      const userModel = new UserModel(user);
      const successResponse = new SuccessResponse<UserResponse>(userModel.toResponse());
      res.json(successResponse);
    } catch (error) {
      console.log(error);
      sendInternalServerError(res);
    }
  }
}

export default UserController;
