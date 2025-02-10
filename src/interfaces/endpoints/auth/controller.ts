import { Request, Response } from 'express';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import UserService from '@entities/user/service';
import {LoginRequestBody, RegisterRequestBody} from './types';
import RequestHandler from '@interfaces/request-handler';
import { UserModel } from '@entities/user/model';
import UserUtils from '@entities/user/utils';

class AuthController extends RequestHandler {
    private readonly userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    async login(req: Request<unknown, unknown, LoginRequestBody>, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await this.userService.getUserByEmail(email);

            if (!user) {
                return this.sendError(res, HttpCode.BadRequest, ErrorCode.UserNotFound, 'User not found.');
            }

            const isMatch = await UserUtils.comparePasswords(password, user.password);

            if (!isMatch) {
                return this.sendError(res, HttpCode.Forbidden, ErrorCode.InvalidPassword, 'Invalid password.');
            }

            const token = UserUtils.generateToken(user);
            this.sendResponse(res, { token });
        } catch (error) {
            console.error('Error during login:', error);
            this.sendInternalError(res);
        }
    }

    async register(req: Request<unknown, unknown, RegisterRequestBody>, res: Response) {
        try {
            const { name, email, password } = req.body;
            const existingUser = await this.userService.getUserByEmail(email);

            if (existingUser) {
                return this.sendError(
                    res,
                    HttpCode.Conflict,
                    ErrorCode.UserAlreadyExists,
                    'A user with this email already exists.'
                );
            }

            const newUser = await this.userService.createUser(name, email, password);
            const userModel = new UserModel(newUser);
            this.sendResponse(res, userModel.toResponse(), HttpCode.Created);
        } catch (error) {
            console.error('Error registering user:', error);
            this.sendInternalError(res);
        }
    }
}

export default AuthController;
