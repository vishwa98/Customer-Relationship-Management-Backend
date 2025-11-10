import { Request, Response, NextFunction } from 'express';
import { CustomerNotFoundError } from '../../domain/errors/CustomerNotFoundError';
import { EmailAlreadyExistsError } from '../../domain/errors/EmailAlreadyExistsError';

export function errorMiddleware(error: Error, req: Request, res: Response, _next: NextFunction) {
  // Handle Customer not found error
  if (error instanceof CustomerNotFoundError) {
    return res.status(404).json({
      error: 'Customer not found',
      message: error.message,
    });
  }

  // Handle Email already exists error
  if (error instanceof EmailAlreadyExistsError) {
    return res.status(409).json({
      error: 'Email already exists',
      message: error.message,
    });
  }

  // Handle validation errors (from Zod)
  if (error.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation error',
      message: error.message,
    });
  }

  // Handle database errors
  if (error.name === 'QueryFailedError' || error.name === 'TypeORMError') {
    const isDevelopment = process.env.NODE_ENV === 'development';
    return res.status(500).json({
      error: 'Database error',
      message: isDevelopment ? error.message : 'An error occurred while processing your request',
    });
  }

  // Handle generic errors
  const isDevelopment = process.env.NODE_ENV === 'development';
  console.error('Error:', error);

  res.status(500).json({
    error: 'Internal server error',
    message: isDevelopment ? error.message : 'An unexpected error occurred',
  });
}
