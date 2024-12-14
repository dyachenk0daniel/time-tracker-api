import { Response } from 'express';
import { ErrorResponse } from '@interfaces/response-models';
import { ErrorCode } from '@interfaces/error-code';
import HttpCode from '@interfaces/http-code';

const defaultErrorMessage = 'An error occurred while processing your request';

/**
 * Sends an HTTP 500 (Internal Server Error) response with a standardized error message.
 *
 * This function is used in controllers to handle unexpected server-side errors
 * and respond with a clear and consistent error structure.
 *
 * @param {Response} res - The Express response object used to send the error response.
 * @param {string} [errorMessage='An error occurred while processing your request'] -
 * An optional custom error message to include in the response. Defaults to a generic message.
 *
 * @example
 * try {
 *   // Some server logic
 * } catch (error) {
 *   sendInternalServerError(res, 'Custom error message');
 * }
 */
function sendInternalServerError(res: Response, errorMessage: string = defaultErrorMessage) {
  const serverError = new ErrorResponse(ErrorCode.ServerError, errorMessage);
  res.status(HttpCode.InternalServerError).json(serverError);
}

export default sendInternalServerError;
