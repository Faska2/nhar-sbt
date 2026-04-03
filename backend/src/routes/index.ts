import { Router } from 'express'
import { authRouter } from './authRoutes.js'
import { productRouter } from './productRoutes.js'
import { categoryRouter } from './categoryRoutes.js'
import { cartRouter } from './cartRoutes.js'
import { orderRouter } from './orderRoutes.js'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/products', productRouter)
apiRouter.use('/categories', categoryRouter)
apiRouter.use('/cart', cartRouter)
apiRouter.use('/orders', orderRouter)

