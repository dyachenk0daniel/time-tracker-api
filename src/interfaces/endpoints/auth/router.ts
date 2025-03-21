import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import AuthController from '@interfaces/endpoints/auth/controller';
import { loginValidationRules, registerValidationRules } from './validation';
import validateRequest from '@interfaces/middlewares/validate-request';
import { ErrorCode } from '@interfaces/error-code';
import { ErrorBody } from '@interfaces/response-models';

const authRouter = Router();
const authController = new AuthController();

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
 *     description: Authenticate user using email and password. Returns a JWT token on successful login.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                     token:
 *                       type: string
 *                       description: JWT token.
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Missing email or password / User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: BAD_REQUEST
 *                     message:
 *                       type: string
 *                       example: Email and password are required.
 *       403:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: INVALID_PASSWORD
 *                     message:
 *                       type: string
 *                       example: Invalid password.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: SERVER_ERROR
 *                     message:
 *                       type: string
 *                       example: An error occurred while processing your request.
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
 *     summary: User registration
 *     description: Register a new user by providing name, email, and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's full name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       201:
 *         description: User successfully registered
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
 *                     id:
 *                       type: string
 *                       description: The ID of the newly created user.
 *                       example: 12345
 *                     name:
 *                       type: string
 *                       description: The user's full name.
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       description: The user's email address.
 *                       example: john.doe@example.com
 *       400:
 *         description: Missing fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: FIELDS_MISSING
 *                     message:
 *                       type: string
 *                       example: All fields are required.
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: USER_ALREADY_EXISTS
 *                     message:
 *                       type: string
 *                       example: A user with this email already exists.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: SERVER_ERROR
 *                     message:
 *                       type: string
 *                       example: An error occurred while processing your request.
 */
authRouter.post('/register', registerValidationRules, validateRequest, authController.register.bind(authController));

export default authRouter;
