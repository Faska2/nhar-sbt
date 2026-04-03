import { Router } from 'express'
import { z } from 'zod'
import * as cartController from '../controllers/cartController.js'
import { requireAuth } from '../middlewares/auth.js'
import { validateBody, validateParams } from '../middlewares/validate.js'

export const cartRouter = Router()

cartRouter.use(requireAuth)

cartRouter.get('/', cartController.get)

cartRouter.post(
  '/items',
  validateBody(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive()
    })
  ),
  cartController.addItem
)

cartRouter.patch(
  '/items/:itemId',
  validateParams(z.object({ itemId: z.string().min(1) })),
  validateBody(z.object({ quantity: z.number().int() })),
  cartController.updateItem
)

cartRouter.delete(
  '/items/:itemId',
  validateParams(z.object({ itemId: z.string().min(1) })),
  cartController.removeItem
)

