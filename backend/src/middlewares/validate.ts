import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'
import { AppError, formatZodError } from '../utils/errors.js'

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      return next(new AppError('Validation failed', 400, formatZodError(parsed.error)))
    }
    req.body = parsed.data
    next()
  }
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params)
    if (!parsed.success) {
      return next(new AppError('Validation failed', 400, formatZodError(parsed.error)))
    }
    req.params = parsed.data
    next()
  }
}

