import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import type { UserRole } from '@prisma/client'

export function signAccessToken(payload: { userId: string; role: UserRole }) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string; role: UserRole }
}

