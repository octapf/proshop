import express from 'express'
const router = express.Router()
import {
	getProducts,
	getProductById,
	getTopProducts,
	deleteProductById,
	createProduct,
	updateProductById,
	createReview,
	deleteReview,
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

// @route /api/products

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/top').get(getTopProducts)
router
	.route('/:id')
	.get(getProductById)
	.delete(protect, admin, deleteProductById)
	.put(protect, admin, updateProductById)

router
	.route('/:id/reviews')
	.post(protect, createReview)
	.delete(protect, deleteReview)

export default router
