import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../utils/jwt.js'
import { AppError } from '../utils/errors.js'

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.header('authorization')
  if (!header) return next(new AppError('Unauthorized', 401))

  const [type, token] = header.split(' ')
  if (type !== 'Bearer' || !token) return next(new AppError('Unauthorized', 401))

  try {
    const payload = verifyAccessToken(token)
    req.user = { id: payload.userId, role: payload.role }
    next()
  } catch {
    next(new AppError('Unauthorized', 401))
  }
}

