import { asyncHandler } from '../utils/asyncHandler.js'
import * as orderService from '../services/orderService.js'
import { OrderStatus } from '@prisma/client'

export const create = asyncHandler(async (req, res) => {
  const order = await orderService.createOrderFromCart(req.user!.id, req.body)
  res.status(201).json({ order })
})

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user!.id)
  res.status(200).json({ orders })
})

export const getOne = asyncHandler(async (req, res) => {
  const isAdmin = req.user!.role === 'ADMIN'
  const order = await orderService.getOrder(req.user!.id, req.params.id!, isAdmin)
  res.status(200).json({ order })
})

export const adminAll = asyncHandler(async (_req, res) => {
  const orders = await orderService.adminGetAllOrders()
  res.status(200).json({ orders })
})

export const adminUpdateStatus = asyncHandler(async (req, res) => {
  const status = req.body.status as OrderStatus
  const order = await orderService.adminUpdateOrderStatus(req.params.id!, status)
  res.status(200).json({ order })
})
