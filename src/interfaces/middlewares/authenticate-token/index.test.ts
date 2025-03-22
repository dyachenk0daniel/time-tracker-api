import { NextFunction, Request, Response } from 'express';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import UserUtils from '@entities/user/utils';
import { authenticateToken } from './index';
import { ErrorBody } from '@interfaces/response-models';

describe('authenticateToken', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.MockedFunction<NextFunction>;
    const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

    beforeEach(() => {
        mockRequest = {
            headers: {},
            body: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
        jest.spyOn(UserUtils, 'verifyAccessToken').mockImplementation((token) => {
            if (token === 'valid_token') return { id: mockUserId };
            throw new Error('Invalid token');
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if Authorization header is missing', () => {
        authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpCode.BadRequest);
        expect(mockResponse.json).toHaveBeenCalledWith(
            new ErrorBody(ErrorCode.AuthorizationHeaderMissing, 'Authorization header is missing.')
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should set userId and call next for valid token', () => {
        mockRequest.headers = {
            authorization: 'Bearer valid_token',
        };

        authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(UserUtils.verifyAccessToken).toHaveBeenCalledWith('valid_token');
        expect(mockRequest.body.userId).toBe(mockUserId);
        expect(mockNext).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token format', () => {
        mockRequest.headers = {
            authorization: 'InvalidFormat',
        };

        authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpCode.Unauthorized);
        expect(mockResponse.json).toHaveBeenCalledWith(
            new ErrorBody(ErrorCode.InvalidOrExpiredToken, 'Invalid or expired token.')
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 for expired/invalid token', () => {
        mockRequest.headers = {
            authorization: 'Bearer invalid_token',
        };

        authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpCode.Unauthorized);
        expect(mockResponse.json).toHaveBeenCalledWith(
            new ErrorBody(ErrorCode.InvalidOrExpiredToken, 'Invalid or expired token.')
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle unexpected errors', () => {
        jest.spyOn(UserUtils, 'verifyAccessToken').mockImplementationOnce(() => {
            throw new Error('Unexpected error');
        });
        mockRequest.headers = {
            authorization: 'Bearer valid_token',
        };

        authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpCode.Unauthorized);
        expect(mockResponse.json).toHaveBeenCalledWith(
            new ErrorBody(ErrorCode.InvalidOrExpiredToken, 'Invalid or expired token.')
        );
    });
});
