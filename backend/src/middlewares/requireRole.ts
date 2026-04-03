import type { NextFunction, Request, Response } from 'express'
import type { UserRole } from '@prisma/client'
import { AppError } from '../utils/errors.js'

export function requireRole(role: UserRole) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Unauthorized', 401))
    if (req.user.role !== role) return next(new AppError('Forbidden', 403))
    next()
  }
}

