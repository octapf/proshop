import * as userActions from '../constants/userConstants'
import * as orderActions from '../constants/orderConstants'
import * as cartActions from '../constants/cartConstants'
import axios from 'axios'

export const login = (email, password) => async (dispatch) => {
	try {
		dispatch({
			type: userActions.USER_LOGIN_REQUEST,
		})

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		const { data } = await axios.post(
			'/api/users/login',
			{
				email,
				password,
			},
			config
		)

		dispatch({
			type: userActions.USER_LOGIN_SUCCESS,
			payload: data,
		})

		localStorage.setItem('userInfo', JSON.stringify(data))
	} catch (error) {
		dispatch({
			type: userActions.USER_LOGIN_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const logout = () => async (dispatch) => {
	try {
		localStorage.removeItem('userInfo')
		localStorage.removeItem('cartItems')
		localStorage.removeItem('paymentMethod')
		localStorage.removeItem('shippingAddress')

		dispatch({
			type: userActions.USER_LOGOUT,
		})
		dispatch({
			type: userActions.USER_DETAILS_RESET,
		})
		dispatch({ type: userActions.USER_LIST_RESET })
		dispatch({
			type: orderActions.ORDER_LIST_MY_RESET,
		})
		dispatch({
			type: orderActions.ORDER_DETAILS_RESET,
		})
		dispatch({
			type: cartActions.CART_RESET,
		})
	} catch (error) {
		dispatch({
			type: userActions.USER_LOGIN_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const register = (name, email, password) => async (dispatch) => {
	try {
		dispatch({
			type: userActions.USER_REGISTER_REQUEST,
		})

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		const { data } = await axios.post(
			'/api/users',
			{
				name,
				email,
				password,
			},
			config
		)

		dispatch({
			type: userActions.USER_REGISTER_SUCCESS,
			payload: data,
		})

		dispatch({
			type: userActions.USER_LOGIN_SUCCESS,
			payload: data,
		})

		localStorage.setItem('userInfo', JSON.stringify(data))
	} catch (error) {
		dispatch({
			type: userActions.USER_REGISTER_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const getUserDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: userActions.USER_DETAILS_REQUEST,
		})

		const {
			userLogin: { userInfo },
		} = getState()

		// const { token } = JSON.parse(localStorage.getItem('userInfo'))

		const config = {
			headers: {
				authorization: `Bearer ${userInfo.token}`,
			},
		}

		const response = await fetch(`api/users/${id}`, config)

		const data = await response.json()

		dispatch({
			type: userActions.USER_DETAILS_SUCCESS,
			payload: data,
		})
	} catch (error) {
		dispatch({
			type: userActions.USER_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: userActions.USER_UPDATE_PROFILE_REQUEST,
		})

		// getState() brings you the whole state object
		const {
			userLogin: {
				userInfo: { token },
			},
		} = getState()

		const config = {
			method: 'PUT',
			headers: {
				authorization: `Bearer ${token}`,
				'Content-Type': 'Application/json',
			},
			body: JSON.stringify(user),
		}

		const response = await fetch('/api/users/profile', config)

		const responseData = await response.json()

		dispatch({
			type: userActions.USER_UPDATE_PROFILE_SUCCESS,
			payload: responseData,
		})
	} catch (error) {
		dispatch({
			type: userActions.USER_UPDATE_PROFILE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const listUsers = () => async (dispatch, getState) => {
	try {
		dispatch({ type: userActions.USER_LIST_REQUEST })

		const {
			userLogin: {
				userInfo: { token },
			},
		} = getState()

		const response = await fetch('http://localhost:3000/api/users', {
			headers: { Authorization: `Bearer ${token}` },
		})

		const data = await response.json()

		dispatch({ type: userActions.USER_LIST_SUCCESS, payload: data })
	} catch (error) {
		dispatch({
			type: userActions.USER_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const deleteUser = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: userActions.USER_DELETE_REQUEST })

		const {
			userLogin: {
				userInfo: { token },
			},
		} = getState()

		const response = await fetch(`http://localhost:3000/api/users/${id}`, {
			headers: { authorization: `Bearer ${token}` },
			method: 'DELETE',
		})

		await response.json()

		dispatch({ type: userActions.USER_DELETE_SUCCESS })
	} catch (error) {
		dispatch({
			type: userActions.USER_DELETE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const updateUser = (user) => async (dispatch, getState) => {
	try {
		dispatch({ type: userActions.USER_UPDATE_REQUEST })

		const {
			userLogin: {
				userInfo: { token },
			},
		} = getState()

		const response = await fetch(
			`http://localhost:3000/api/users/${user._id}`,
			{
				headers: {
					authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				method: 'PUT',
				body: JSON.stringify(user),
			}
		)

		const data = await response.json()

		dispatch({ type: userActions.USER_UPDATE_SUCCESS, payload: data })
	} catch (error) {
		dispatch({
			type: userActions.USER_UPDATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const getUser = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: userActions.USER_GET_REQUEST })

		const {
			userLogin: {
				userInfo: { token },
			},
		} = getState()

		const response = await fetch(`http://localhost:3000/api/users/${id}`, {
			headers: {
				authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		})

		const data = await response.json()

		dispatch({ type: userActions.USER_GET_SUCCESS, payload: data })
	} catch (error) {
		dispatch({
			type: userActions.USER_GET_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}
