import { NextFunction, Request, Response } from 'express';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import RequestHandler from '@interfaces/request-handler';
import { HttpException } from '@interfaces/response-models';
import UserService from '@entities/user/service';
import { UserModel } from '@entities/user/model';
import UserUtils from '@entities/user/utils';
import { LoginRequestBody, RegisterRequestBody } from './types';

class AuthController extends RequestHandler {
    private readonly userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    async login(req: Request<unknown, unknown, LoginRequestBody>, res: Response, next: NextFunction) {
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

            const token = UserUtils.generateToken(user);
            this.sendResponse(res, { token });
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
}

export default AuthController;
