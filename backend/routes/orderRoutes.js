import express from 'express'
import {
	getMyOrders,
	getOrders,
	getOrderById,
	addOrderItems,
	updateOrderToPaid,
	updateOrderToDelivered,
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

// @route /api/orders

const router = express.Router()

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)

router.route('/myorders').get(protect, getMyOrders)

router.route('/:id').get(protect, getOrderById)

router.route('/:id/pay').put(protect, updateOrderToPaid)

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)

export default router
