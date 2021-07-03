import express from 'express'
const router = express.Router()
import {
	getProducts,
	getProductById,
	deleteProductById,
	createProduct,
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getProducts).post(protect, admin, createProduct)
router
	.route('/:id')
	.get(getProductById)
	.delete(protect, admin, deleteProductById)

export default router
