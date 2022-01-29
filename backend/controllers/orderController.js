import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// @desc Get logged in user orders
// @route GET  /api/orders/myorders
// @access Private

export const getMyOrders = asyncHandler(async (req, res) => {
	try {
		const user = req.user

		const orders = await Order.find({ user: user._id })

		res.status(200).json(orders)
	} catch (error) {
		res.status(404)
		throw new Error('Orders not found')
	}
})

// @desc Get orders by Id
// @route GET  /api/orders/:id
// @access Private

export const getOrderById = asyncHandler(async (req, res) => {
	try {
		const orderId = req.params.id

		const order = await Order.findById(orderId).populate('user', 'name email')

		if (order) {
			res.status(200).json(order)
		}
	} catch (error) {
		console.error(error)
		res.status(404)
		throw new Error(`Order not found with id: ${req.params.id}`)
	}
})

// @desc Update order to paid
// @route PUT  /api/orders/:id/pay
// @access Private

export const updateOrderToPaid = asyncHandler(async (req, res) => {
	try {
		const order = await Order.findById(req.params.id)

		if (order) {
			order.isPaid = true
			order.paidAt = Date.now()
			order.paymentResult = {
				id: req.body.id,
				status: req.body.status,
				update_time: req.body.update_time,
				email_address: req.body.payer.email_address,
			}

			const updatedOrder = await order.save()

			res.json(updatedOrder)
		}
	} catch (error) {
		console.error(error)
		res.status(404)
		throw new Error(`Order not found with id: ${req.params.id}`)
	}
})

// @desc Create new order
// @route POST  /api/orders/
// @access Private

export const addOrderItems = asyncHandler(async (req, res) => {
	try {
		const {
			orderItems,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			shippingPrice,
			taxPrice,
			totalPrice,
		} = req.body

		if (orderItems && orderItems.length === 0) {
			res.status(400)
			throw new Error('No order items')
		} else {
			const order = new Order({
				orderItems,
				user: req.user._id,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				shippingPrice,
				taxPrice,
				totalPrice,
			})
			const createdOrder = await order.save()

			res.status(201).json(createdOrder)
		}
	} catch (error) {
		console.error(error)
		res.status(400)
		throw new Error('Bad request')
	}
})

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin

export const getOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({}).populate('user', 'id name')

	if (orders) {
		res.json(orders)
	} else {
		res.status(404)
		throw new Error('No orders found')
	}
})

// @desc Update order to delivered
// @route PUT  /api/orders/:id/deliver
// @access Private/Admin

export const updateOrderToDelivered = asyncHandler(async (req, res) => {
	try {
		const order = await Order.findById(req.params.id)

		if (order) {
			order.isDelivered = true
			order.deliveredAt = Date.now()

			const updatedOrder = await order.save()

			res.json(updatedOrder)
		}
	} catch (error) {
		console.error(error)
		res.status(404)
		throw new Error(`Order not found with id: ${req.params.id}`)
	}
})
