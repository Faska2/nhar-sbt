import { prisma } from '../db/prisma.js'
import { AppError } from '../utils/errors.js'

async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({ where: { userId } })
  if (existing) return existing
  return prisma.cart.create({ data: { userId } })
}

export async function getCart(userId: string) {
  const cart = await getOrCreateCart(userId)
  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: {
          product: { include: { images: true, category: true } }
        }
      }
    }
  })
}

export async function addToCart(userId: string, input: { productId: string; quantity: number }) {
  const product = await prisma.product.findUnique({ where: { id: input.productId } })
  if (!product) throw new AppError('Product not found', 404)
  if (product.stock < input.quantity) throw new AppError('Not enough stock', 400)

  const cart = await getOrCreateCart(userId)

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId: input.productId }
  })

  if (existingItem) {
    const nextQty = existingItem.quantity + input.quantity
    if (product.stock < nextQty) throw new AppError('Not enough stock', 400)
    await prisma.cartItem.update({ where: { id: existingItem.id }, data: { quantity: nextQty } })
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: input.productId, quantity: input.quantity }
    })
  }

  return getCart(userId)
}

export async function updateCartItem(
  userId: string,
  itemId: string,
  input: { quantity: number }
) {
  const cart = await getOrCreateCart(userId)
  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } })
  if (!item) throw new AppError('Cart item not found', 404)

  const product = await prisma.product.findUnique({ where: { id: item.productId } })
  if (!product) throw new AppError('Product not found', 404)
  if (product.stock < input.quantity) throw new AppError('Not enough stock', 400)

  if (input.quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } })
  } else {
    await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: input.quantity } })
  }

  return getCart(userId)
}

export async function removeCartItem(userId: string, itemId: string) {
  const cart = await getOrCreateCart(userId)
  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } })
  if (!item) throw new AppError('Cart item not found', 404)
  await prisma.cartItem.delete({ where: { id: item.id } })
  return getCart(userId)
}

export async function clearCart(userId: string) {
  const cart = await getOrCreateCart(userId)
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
}

