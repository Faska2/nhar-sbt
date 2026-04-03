import { prisma } from '../db/prisma.js'
import { AppError } from '../utils/errors.js'
import { getCart } from './cartService.js'
import { OrderStatus } from '@prisma/client'

export async function createOrderFromCart(
  userId: string,
  input: {
    shippingName: string
    shippingAddress1: string
    shippingCity: string
    shippingCountry: string
  }
) {
  const cart = await getCart(userId)
  if (!cart) throw new AppError('Cart not found', 404)
  if (cart.items.length === 0) throw new AppError('Cart is empty', 400)

  const items = cart.items

  for (const ci of items) {
    if (ci.product.stock < ci.quantity) {
      throw new AppError(`Not enough stock for ${ci.product.name}`, 400)
    }
  }

  const subtotal = items.reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0)
  const total = subtotal

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        status: OrderStatus.PENDING,
        subtotal,
        total,
        shippingName: input.shippingName,
        shippingAddress1: input.shippingAddress1,
        shippingCity: input.shippingCity,
        shippingCountry: input.shippingCountry,
        items: {
          create: items.map((ci) => ({
            productId: ci.productId,
            quantity: ci.quantity,
            unitPrice: ci.product.price,
            nameSnapshot: ci.product.name,
            imageUrl: ci.product.images[0]?.url
          }))
        }
      },
      include: { items: true }
    })

    for (const ci of items) {
      await tx.product.update({
        where: { id: ci.productId },
        data: { stock: { decrement: ci.quantity } }
      })
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

    return created
  })

  return order
}

export async function getMyOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  })
}

export async function getOrder(userId: string, orderId: string, isAdmin: boolean) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  })
  if (!order) throw new AppError('Order not found', 404)
  if (!isAdmin && order.userId !== userId) throw new AppError('Forbidden', 403)
  return order
}

export async function adminGetAllOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true, user: { select: { id: true, email: true } } }
  })
}

export async function adminUpdateOrderStatus(orderId: string, status: OrderStatus) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) throw new AppError('Order not found', 404)
  return prisma.order.update({ where: { id: orderId }, data: { status }, include: { items: true } })
}
