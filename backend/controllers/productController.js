import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc Fetch all products
// @route GET /api/products
// @access PUBLIC
const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 10
	const page = Number(req.query.pageNumber) || 1

	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'i',
				},
		  }
		: {}

	const count = await Product.countDocuments({ ...keyword })

	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1))
	res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc Fetch single product
// @route GET /api/products/:id
// @access PUBLIC

const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id)

	if (product) {
		res.json(product)
	} else {
		res.status(404)
		throw new Error('Product not found')
	}
})

// @desc Delete single product
// @route DELETE /api/products/:id
// @access PRIVATE/ADMIM

const deleteProductById = asyncHandler(async (req, res) => {
	const productId = req.params.id

	if (productId) {
		const productDeleted = await Product.findByIdAndRemove({ _id: productId })

		if (productDeleted) {
			res.status(200).json(productDeleted)
		} else {
			res.status(404)
			throw new Error(`Product with id ${productId} not found`)
		}
	}
})

// @desc Create single product
// @route POST /api/products/
// @access PRIVATE/ADMIM

const createProduct = asyncHandler(async (req, res) => {
	const {
		user,
		name,
		image,
		brand,
		category,
		description,
		rating,
		numReviews,
		price,
		countInStock,
	} = req.body

	if (
		user &&
		name &&
		image &&
		brand &&
		category &&
		description &&
		!isNaN(rating) &&
		!isNaN(numReviews) &&
		!isNaN(price) &&
		!isNaN(countInStock)
	) {
		const newProduct = await new Product({
			user,
			name,
			image,
			brand,
			category,
			description,
			rating,
			numReviews,
			price,
			countInStock,
		}).save()

		res.status(201).json(newProduct)
	} else {
		res.status(400)
		throw new Error('Bad request')
	}
})

// @desc Update single product
// @route PUT /api/products/:id
// @access PRIVATE/ADMIN

const updateProductById = asyncHandler(async (req, res) => {
	const productId = req.params.id
	const product = req.body

	if (product && productId) {
		const updatedProduct = await Product.findByIdAndUpdate(
			{ _id: productId },
			product,
			{ new: true }
		)

		if (updatedProduct) {
			res.status(200).json(updatedProduct)
		} else {
			res.status(400)
		}
	} else {
		res.status(400)
	}
})

// @desc Create single review
// @route POST /api/products/:id/reviews
// @access PRIVATE

const createReview = asyncHandler(async (req, res) => {
	const productId = req.params.id
	const newReview = req.body

	if (newReview && productId) {
		const product = await Product.findById(productId)

		if (product) {
			const alreadyReviewed = product.reviews.find(
				(rev) => rev.user.toString() === newReview.user.toString()
			)

			if (alreadyReviewed) {
				console.log('yes')
				res.status(400)
				throw new Error('Product already reviewed')
			}
			product.reviews.push(newReview)
			product.numReviews = product.reviews.length

			product.rating =
				product.reviews.reduce((acc, rev) => (acc += rev.rating), 0) /
				product.numReviews

			const savedProduct = await product.save()
			res.status(201).json(savedProduct)
		} else {
			res.status(404)
			throw new Error('Product not found')
		}
	} else {
		res.status(400)
	}
})

// @desc Delete single review
// @route DELETE /api/products/:id/review
// @access PRIVATE

const deleteReview = asyncHandler(async (req, res) => {
	const productId = req.params.id
	const { _id: reviewId } = req.body

	if (reviewId && productId) {
		const product = await Product.findById(productId)

		const existingReview = product.reviews.find(
			(r) => r._id.toString() === reviewId.toString()
		)

		if (!existingReview) {
			res.status(400)
			throw new Error('Review does not exist')
		}

		const newReviews = product.reviews.filter(
			(rev) => rev._id.toString() !== reviewId.toString()
		)

		product.reviews = newReviews

		product.numReviews = product.reviews.length

		const newProduct = await product.save()

		if (newProduct) {
			res.status(200).json({ message: 'Review deleted' })
		} else {
			res.status(404)
			throw new Error('Product not found')
		}
	} else {
		res.status(400)
	}
})

// @desc Get top rated products
// @route GET /api/products/top
// @access PUBLIC

const getTopProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({}).sort({ rating: -1 }).limit(3)

	if (products) {
		res.status(200).json({ products })
	} else {
		res.status(400)
		throw new Error('Here is the error')
	}
})

export {
	getProducts,
	getProductById,
	getTopProducts,
	deleteProductById,
	createProduct,
	updateProductById,
	createReview,
	deleteReview,
}
