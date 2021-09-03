import axios from 'axios'
import * as actions from '../constants/productConstants'

export const listProducts =
	(keyword = '', pageNumber = '') =>
	async (dispatch) => {
		try {
			dispatch({ type: actions.PRODUCT_LIST_REQUEST })
			const { data } = await axios.get(
				`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
			)
			dispatch({ type: actions.PRODUCT_LIST_SUCCESS, payload: data })
		} catch (error) {
			dispatch({
				type: actions.PRODUCT_LIST_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			})
		}
	}

export const getProduct = (id) => async (dispatch) => {
	try {
		dispatch({ type: actions.PRODUCT_SINGLE_REQUEST })
		const { data } = await axios.get(`/api/products/${id}`)

		dispatch({ type: actions.PRODUCT_SINGLE_SUCCESS, payload: data })
	} catch (error) {
		dispatch({
			type: actions.PRODUCT_SINGLE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const deleteProduct = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: actions.PRODUCT_DELETE_REQUEST })

		const {
			userLogin: {
				userInfo: { token },
			},
		} = getState()

		const response = await fetch(`/api/products/${id}`, {
			headers: { authorization: `Bearer ${token}` },
			method: 'DELETE',
		})

		const data = await response.json()

		dispatch({ type: actions.PRODUCT_DELETE_SUCCESS, payload: data })
	} catch (error) {
		dispatch({
			type: actions.PRODUCT_DELETE_SUCCESS,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const updateProduct = (product) => async (dispatch, getState) => {
	try {
		dispatch({ type: actions.PRODUCT_UPDATE_REQUEST })

		const {
			userLogin: {
				userInfo: { token },
			},
		} = getState()

		const response = await fetch(`/api/products/${product._id}`, {
			headers: {
				authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			method: 'PUT',
			body: JSON.stringify(product),
		})

		const data = await response.json()

		dispatch({ type: actions.PRODUCT_UPDATE_SUCCESS, payload: data })
	} catch (error) {
		dispatch({
			type: actions.PRODUCT_UPDATE_SUCCESS,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const createProduct = (product) => async (dispatch, getState) => {
	try {
		dispatch({ type: actions.PRODUCT_CREATE_REQUEST })

		const {
			userLogin: {
				userInfo: { token },
			},
		} = getState()

		const response = await fetch('/api/products', {
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${token}`,
			},
			method: 'POST',
			body: JSON.stringify(product),
		})

		const data = await response.json()

		dispatch({ type: actions.PRODUCT_CREATE_SUCCESS, payload: data })
	} catch (error) {
		dispatch({
			type: actions.PRODUCT_CREATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const createProductReview =
	(productId, review) => async (dispatch, getState) => {
		try {
			dispatch({ type: actions.PRODUCT_CREATE_REVIEW_REQUEST })

			const {
				userLogin: {
					userInfo: { token },
				},
			} = getState()

			await fetch(`/api/products/${productId}/reviews`, {
				headers: {
					'Content-Type': 'application/json',
					authorization: `Bearer ${token}`,
				},
				method: 'POST',
				body: JSON.stringify(review),
			})

			dispatch({ type: actions.PRODUCT_CREATE_REVIEW_SUCCESS })
		} catch (error) {
			dispatch({
				type: actions.PRODUCT_CREATE_REVIEW_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			})
		}
	}

export const listTopProducts = () => async (dispatch) => {
	try {
		dispatch({ type: actions.PRODUCT_TOP_REQUEST })

		const response = await fetch(`/api/products/top`)

		const data = await response.json()

		dispatch({ type: actions.PRODUCT_TOP_SUCCESS, payload: data })
	} catch (error) {
		dispatch({
			type: actions.PRODUCT_TOP_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}
