import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors.js'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
    // Ожидаемая ошибка — возвращаем клиенту
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    })
  }

  // Неожиданная ошибка — логируем и возвращаем generic 500
  console.error('Unexpected error:', err)

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      // НЕ отправляем err.message или stack trace клиенту!
    },
  })
}