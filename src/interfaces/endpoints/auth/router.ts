import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import AuthController from '@interfaces/endpoints/auth/controller';
import { loginValidationRules, registerValidationRules } from './validation';
import validateRequest from '@interfaces/middlewares/validate-request';
import { ErrorCode } from '@interfaces/error-code';
import { ErrorBody } from '@interfaces/response-models';
import { PrismaClient } from '@prisma/client';
import UserService from '@entities/user/service';

const authRouter = Router();
const prisma = new PrismaClient();
const userService = new UserService(prisma);
const authController = new AuthController(userService);

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Maximum 5 attempts
    message: new ErrorBody(ErrorCode.TooManyAttempts, 'Too many requests, please try again later.'),
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and return JWT tokens
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequestBody'
 *     responses:
 *       200:
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error or missing credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validationError:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: BAD_REQUEST
 *                     message: Email and password are required
 *                     details: [{"msg":"Invalid email","param":"email"}]
 *               userNotFound:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: USER_NOT_FOUND
 *                     message: User not found
 *       403:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidPassword:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: INVALID_PASSWORD
 *                     message: Invalid password
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               serverError:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: INTERNAL_SERVER_ERROR
 *                     message: An error occurred while processing your request
 */
authRouter.post(
    '/login',
    loginLimiter,
    loginValidationRules,
    validateRequest,
    authController.login.bind(authController)
);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     description: Create a new user account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequestBody'
 *           examples:
 *             validRequest:
 *               value:
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 password: "securePassword123"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *             examples:
 *               successResponse:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "550e8400-e29b-41d4-a716-446655440000"
 *                     name: "John Doe"
 *                     email: "john.doe@example.com"
 *                     createdAt: "2023-08-01T12:34:56Z"
 *                     updatedAt: null
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidEmail:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "BAD_REQUEST"
 *                     message: "Validation failed"
 *                     details:
 *                       - msg: "Invalid email"
 *                         param: "email"
 *               shortPassword:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "BAD_REQUEST"
 *                     message: "Validation failed"
 *                     details:
 *                       - msg: "Password must be at least 6 characters long"
 *                         param: "password"
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               userExists:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "USER_ALREADY_EXISTS"
 *                     message: "A user with this email already exists"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               databaseError:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INTERNAL_SERVER_ERROR"
 *                     message: "Could not create user"
 *                     details: "Database connection failed"
 */
authRouter.post('/register', registerValidationRules, validateRequest, authController.register.bind(authController));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Generates new access and refresh tokens using a valid refresh token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Missing or invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingToken:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: BAD_REQUEST
 *                     message: Refresh token is required
 *               invalidToken:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: INVALID_OR_EXPIRED_TOKEN
 *                     message: Invalid or expired refresh token
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               userNotFound:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: USER_NOT_FOUND
 *                     message: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               serverError:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: INTERNAL_SERVER_ERROR
 *                     message: Failed to refresh tokens
 */
authRouter.post('/refresh', authController.refresh.bind(authController));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Revokes the current refresh token for a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Logged out successfully
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingUserId:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: BAD_REQUEST
 *                     message: User ID is required
 *               invalidUUID:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: BAD_REQUEST
 *                     message: Invalid user ID format
 *                     details: [{"msg":"Invalid UUID","param":"userId"}]
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               serverError:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: INTERNAL_SERVER_ERROR
 *                     message: Failed to revoke refresh token
 */
authRouter.post('/logout', authController.logout.bind(authController));

export default authRouter;
