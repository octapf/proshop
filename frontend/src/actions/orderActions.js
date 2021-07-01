import * as actions from '../constants/orderConstants'

export const createOrder = (order) => async (dispatch, getState) => {
	try {
		dispatch({
			type: actions.ORDER_CREATE_REQUEST
		})

		const {
			userLogin: {
				userInfo: {
					token
				},
			},
		} = getState()

		const response = await fetch('/api/orders', {
			headers: {
				authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(order),
		})

		const newOrder = await response.json()

		dispatch({
			type: actions.ORDER_CREATE_SUCCESS,
			payload: newOrder
		})
	} catch (error) {
		dispatch({
			type: actions.ORDER_CREATE_FAIL,
			error: error.response && error.response.data.message ?
				error.response.data.message :
				error.message,
		})
	}
}

export const getOrderDetails = (orderId) => async (dispatch, getState) => {
	try {
		dispatch({
			type: actions.ORDER_DETAILS_REQUEST
		})

		//fetch the order details from the backend end point /api/orders/:id

		const {
			userLogin: {
				userInfo: {
					token
				},
			},
		} = getState()

		const config = {
			headers: {
				authorization: `Bearer ${token}`
			},
		}

		const response = await fetch(`/api/orders/${orderId}`, config)

		const data = await response.json()

		dispatch({
			type: actions.ORDER_DETAILS_SUCCESS,
			payload: data
		})
	} catch (error) {
		dispatch({
			type: actions.ORDER_DETAILS_FAIL,
			payload: error.response && error.response.data.message ?
				error.response.data.message :
				error.message,
		})
	}
}

export const payOrder = (id, paymentResult) => async (dispatch, getState) => {
	try {
		dispatch({
			type: actions.ORDER_PAY_REQUEST
		})

		const {
			userLogin: {
				userInfo: {
					token
				},
			},
		} = getState()

		const config = {
			headers: {
				authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			method: 'PUT',
			body: JSON.stringify(paymentResult),
		}

		const response = await fetch(`/api/orders/${id}/pay`, config)

		const data = await response.json()

		dispatch({
			type: actions.ORDER_PAY_SUCCESS,
			payload: data
		})
	} catch (error) {
		dispatch({
			type: actions.ORDER_PAY_FAIL,
			payload: error.response && error.response.data.message ?
				error.response.data.message :
				error.message,
		})
	}
}

export const listMyOrders = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: actions.ORDER_LIST_MY_REQUEST
		})

		const {
			userLogin: {
				userInfo: {
					token
				},
			},
		} = getState()

		const response = await fetch('/api/orders/myorders', {
			headers: {
				authorization: `Bearer ${token}`
			},
		})

		const orders = await response.json()

		if (orders.length === 0) {
			dispatch({
				type: actions.ORDER_LIST_MY_FAIL,
				payload: 'Orders not found',
			})
		} else {
			dispatch({
				type: actions.ORDER_LIST_MY_SUCCESS,
				payload: orders
			})
		}
	} catch (error) {
		dispatch({
			type: actions.ORDER_LIST_MY_FAIL,
			payload: error.response && error.response.data.message ?
				error.response.data.message :
				error.message,
		})
	}
}