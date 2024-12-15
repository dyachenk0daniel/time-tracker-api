import { NextFunction, Request, Response } from 'express';
import HttpCode from '@interfaces/http-code';
import { ErrorCode } from '@interfaces/error-code';
import UserService from '@entities/user/service';
import { ErrorResponse } from '@interfaces/response-models';
import { authenticateToken } from './index';

jest.mock('@entities/user/service');

describe('authenticateToken', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = {
      headers: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 404 if Authorization header is missing', () => {
    authenticateToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HttpCode.NotFound);
    expect(res.json).toHaveBeenCalledWith(new ErrorResponse(ErrorCode.AuthorizationHeaderMissing, 'Authorization header is missing.'));
    expect(next).not.toHaveBeenCalled();
  });

  it('should set req.body.userId and call next if token is valid', () => {
    const mockToken = 'valid_token';
    const mockDecoded = { id: '123' };

    req.headers!.authorization = `Bearer ${mockToken}`;
    jest.mocked(UserService.validateToken).mockReturnValue(mockDecoded);

    authenticateToken(req as Request, res as Response, next);

    expect(UserService.validateToken).toHaveBeenCalledWith(mockToken);
    expect(req.body.userId).toBe(mockDecoded.id);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid or expired', () => {
    const mockToken = 'invalid_token';

    req.headers!.authorization = `Bearer ${mockToken}`;
    jest.mocked(UserService.validateToken).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticateToken(req as Request, res as Response, next);

    expect(UserService.validateToken).toHaveBeenCalledWith(mockToken);
    expect(res.status).toHaveBeenCalledWith(HttpCode.Unauthorized);
    expect(res.json).toHaveBeenCalledWith(new ErrorResponse(ErrorCode.InvalidOrExpiredToken, 'Invalid or expired token.'));
    expect(next).not.toHaveBeenCalled();
  });
});
