import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@interfaces/response-models';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import RequestHandler from '@interfaces/request-handler';
import UserService from '@entities/user/service';
import { UserModel } from '@entities/user/model';

class UserController extends RequestHandler {
    private readonly userService: UserService;

    constructor(userService: UserService) {
        super();
        this.userService = userService;
    }

    async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.body.userId;
            const user = await this.userService.getUserById(userId);

            if (!user) {
                throw new HttpException(HttpCode.NotFound, ErrorCode.UserNotFound, 'User not found.');
            }

            const userModel = new UserModel(user);
            this.sendResponse(res, userModel.toResponse());
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, userId } = req.body;
            const updatedUser = await this.userService.updateUser(userId, name, email);
            const userModel = new UserModel(updatedUser);
            this.sendResponse(res, userModel.toResponse());
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;
