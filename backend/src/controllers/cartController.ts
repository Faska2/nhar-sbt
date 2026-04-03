import { asyncHandler } from '../utils/asyncHandler.js'
import * as cartService from '../services/cartService.js'

export const get = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user!.id)
  res.status(200).json({ cart })
})

export const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addToCart(req.user!.id, req.body)
  res.status(200).json({ cart })
})

export const updateItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateCartItem(req.user!.id, req.params.itemId!, req.body)
  res.status(200).json({ cart })
})

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCartItem(req.user!.id, req.params.itemId!)
  res.status(200).json({ cart })
})
