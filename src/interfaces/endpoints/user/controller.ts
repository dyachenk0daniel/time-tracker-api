import { Request, Response } from 'express';
import { ErrorBody } from '@interfaces/response-models';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import UserService from '@entities/user/service';
import { UserModel } from '@entities/user/model';
import RequestHandler from '@interfaces/request-handler';
import { UserNotFoundError } from '@entities/user/errors';

class UserController extends RequestHandler {
    private readonly userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    private sendUserNotFoundError(res: Response) {
        const userNotFoundError = new ErrorBody(ErrorCode.UserNotFound, 'User not found.');
        res.status(HttpCode.NotFound).json(userNotFoundError);
    }

    async getMe(req: Request, res: Response) {
        try {
            const userId = req.body.userId;
            const user = await this.userService.getUserById(userId);

            if (!user) {
                return this.sendUserNotFoundError(res);
            }

            const userModel = new UserModel(user);
            this.sendResponse(res, userModel.toResponse());
        } catch (error) {
            console.log(error);
            this.sendInternalError(res);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { name, email, userId } = req.body;
            const updatedUser = await this.userService.updateUser(userId, name, email);
            const userModel = new UserModel(updatedUser);
            this.sendResponse(res, userModel.toResponse());
        } catch (error) {
            console.log(error);

            if (error instanceof UserNotFoundError) {
                return this.sendUserNotFoundError(res);
            }

            this.sendInternalError(res);
        }
    }
}

export default UserController;
