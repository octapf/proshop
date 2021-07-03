import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc Fetch all products
// @route GET /api/products
// @access PUBLIC
const getProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({})
	res.json(products)
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
// @route POST /api/products/:id
// @access PRIVATE/ADMIM

const createProduct = asyncHandler(async (req, res) => {
	const product = req.body

	if (product) {
		console.log(product)
		const newProduct = new Product(product)
		console.log(newProduct)

		if (newProduct) {
			res.status(201).json(await newProduct.save())
		} else {
			res.status(400)
		}
	}
})

export { getProducts, getProductById, deleteProductById, createProduct }
