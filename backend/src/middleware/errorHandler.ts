import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/errors';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: any = null;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  } else if (err.code === 'P2025') {
    // Prisma record not found error
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.code === 'P2002') {
    // Prisma unique constraint violation
    statusCode = 409;
    message = 'Unique constraint violation';
  }

  // Structured logs based on operational nature of errors
  if (statusCode === 500) {
    Logger.error('Unhandled server exception caught by middleware:', err);
  } else {
    Logger.warn(`Operational HTTP ${statusCode} response: ${message}`, {
      statusCode,
      details,
      path: req.path,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(details ? { errors: details } : {}),
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}
