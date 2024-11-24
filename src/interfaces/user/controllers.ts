import { Request, Response } from 'express';
import HttpCodes from '../http-codes';

/**
 * Handles the GET request to retrieve all users.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {void}
 */
export function getUsersHandler(req: Request, res: Response): void {
  res.status(HttpCodes.Ok).json({ message: 'all user' });
}
