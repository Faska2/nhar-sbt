import { prisma } from '../db/prisma.js'
import { AppError } from '../utils/errors.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { signAccessToken } from '../utils/jwt.js'
import { UserRole } from '@prisma/client'

export async function register(input: { email: string; password: string; name?: string }) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) throw new AppError('Email is already in use', 409)

  const passwordHash = await hashPassword(input.password)
  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
      role: UserRole.CLIENT
    },
    select: { id: true, email: true, role: true, name: true }
  })

  const token = signAccessToken({ userId: user.id, role: user.role })
  return { user, token }
}

export async function login(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: input.email }
  })
  if (!user) throw new AppError('Invalid email or password', 401)

  const ok = await verifyPassword(input.password, user.passwordHash)
  if (!ok) throw new AppError('Invalid email or password', 401)

  const token = signAccessToken({ userId: user.id, role: user.role })
  return {
    user: { id: user.id, email: user.email, role: user.role, name: user.name },
    token
  }
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, name: true }
  })
  if (!user) throw new AppError('User not found', 404)
  return user
}

