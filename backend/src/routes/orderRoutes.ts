import { Router } from 'express'
import { z } from 'zod'
import * as orderController from '../controllers/orderController.js'
import { requireAuth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/requireRole.js'
import { validateBody, validateParams } from '../middlewares/validate.js'
import { OrderStatus } from '@prisma/client'

export const orderRouter = Router()

orderRouter.use(requireAuth)

orderRouter.get('/admin/all', requireRole('ADMIN'), orderController.adminAll)

orderRouter.patch(
  '/admin/:id/status',
  requireRole('ADMIN'),
  validateParams(z.object({ id: z.string().min(1) })),
  validateBody(z.object({ status: z.nativeEnum(OrderStatus) })),
  orderController.adminUpdateStatus
)

orderRouter.post(
  '/',
  validateBody(
    z.object({
      shippingName: z.string().min(1),
      shippingAddress1: z.string().min(1),
      shippingCity: z.string().min(1),
      shippingCountry: z.string().min(1)
    })
  ),
  orderController.create
)

orderRouter.get('/', orderController.myOrders)

orderRouter.get(
  '/:id',
  validateParams(z.object({ id: z.string().min(1) })),
  orderController.getOne
)
