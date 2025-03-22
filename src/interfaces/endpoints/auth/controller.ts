import { NextFunction, Request, Response } from 'express';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import RequestHandler from '@interfaces/request-handler';
import { HttpException } from '@interfaces/response-models';
import UserService from '@entities/user/service';
import { UserModel } from '@entities/user/model';
import UserUtils from '@entities/user/utils';
import { RegisterRequestBody } from './types';

class AuthController extends RequestHandler {
    private readonly userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const user = await this.userService.getUserByEmail(email);

            if (!user) {
                throw new HttpException(HttpCode.BadRequest, ErrorCode.UserNotFound, 'User not found.');
            }

            const isMatch = await UserUtils.comparePasswords(password, user.password);

            if (!isMatch) {
                throw new HttpException(HttpCode.Forbidden, ErrorCode.InvalidPassword, 'Invalid password.');
            }

            const accessToken = UserUtils.generateAccessToken(user);
            const refreshToken = await UserUtils.generateRefreshToken(user.id);

            this.sendResponse(res, { accessToken, refreshToken });
        } catch (error) {
            next(error);
        }
    }

    async register(req: Request<unknown, unknown, RegisterRequestBody>, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;
            const existingUser = await this.userService.getUserByEmail(email);

            if (existingUser) {
                throw new HttpException(
                    HttpCode.Conflict,
                    ErrorCode.UserAlreadyExists,
                    'A user with this email already exists.'
                );
            }

            const newUser = await this.userService.createUser(name, email, password);
            const userModel = new UserModel(newUser);
            this.sendResponse(res, userModel.toResponse(), HttpCode.Created);
        } catch (error) {
            next(error);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new HttpException(HttpCode.BadRequest, ErrorCode.BadRequest, 'Refresh token is required.');
            }

            const decoded = await UserUtils.verifyRefreshToken(refreshToken);
            const user = await this.userService.getUserById(decoded.userId);

            if (!user) {
                throw new HttpException(HttpCode.Unauthorized, ErrorCode.UserNotFound, 'User not found.');
            }

            const newAccessToken = UserUtils.generateAccessToken(user);
            const newRefreshToken = await UserUtils.generateRefreshToken(user.id);

            this.sendResponse(res, { accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;

            if (!userId) {
                throw new HttpException(HttpCode.BadRequest, ErrorCode.BadRequest, 'User ID is required.');
            }

            await UserUtils.revokeRefreshToken(userId);
            this.sendResponse(res, { message: 'Logged out successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
