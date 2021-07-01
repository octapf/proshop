import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

//@desc Get all users
//@ route GET /api/users
//@access Private/Admin

const getUsers = asyncHandler(async (req, res) => {
	try {
		const users = await User.find({})

		res.status(200).json(users)
	} catch (error) {
		console.error(error)
		res.status(404)
		throw new Error('No users found.')
	}
})

//@desc Register a new user
//@ route POST /api/users
//@access Public

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body

	const userExists = await User.findOne({ email })

	if (userExists) {
		res.status(400)
		throw new Error('User already exists')
	}

	if (name && email && password) {
		const user = await User.create({
			name,
			email,
			password,
		})

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user.id),
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}
})

// @desc Auth user & get token
// @route POST  /api/users/login
// @access Public

const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await User.findOne({ email })

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		})
	} else {
		res.status(401)
		throw new Error('Invalid email or password')
	}
})

// @desc Get user profile
// @route GET  /api/users/profile
// @access Private

const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id)

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		})
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private

const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)

	if (user) {
		user.name = req.body.name || user.name
		user.email = req.body.email || user.email
		if (req.body.password) {
			user.password = req.body.password
		}

		const updatedUser = await user.save()

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(updatedUser.id),
		})
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin

const deleteUser = asyncHandler(async (req, res) => {
	const userId = req.params.id

	if (userId) {
		await User.findByIdAndRemove({ _id: userId })

		res.status(202).json({ message: `User ${userId} removed.` })
	} else {
		res.status(404)
		throw new Error(`User with id ${userId} not found.`)
	}
})

// @desc Get user by id
// @route GET /api/users/:id
// @access Private/Admin

const getUserById = asyncHandler(async (req, res) => {
	const userId = req.params.id

	if (userId) {
		const user = await User.findById({ _id: userId }).select('-password')

		if (user) {
			res.status(200).json(user)
		} else {
			res.status(404)
			throw new Error(`User with id ${userId} not found`)
		}
	} else {
		res.status(404)
		throw new Error(`User with id ${userId} not found`)
	}
})

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin

const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id)

	if (user) {
		user.name = req.body.name || user.name
		user.email = req.body.email || user.email
		if (req.body.isAdmin === undefined) {
			res.status(400)
			throw new Error('Admin field is required')
		}
		user.isAdmin = req.body.isAdmin

		const updatedUser = await user.save()

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		})
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})

export {
	getUsers,
	registerUser,
	authUser,
	getUserProfile,
	updateUserProfile,
	deleteUser,
	getUserById,
	updateUser,
}
