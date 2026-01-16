
import * as actions from '../constants/orderConstants'
import axios from 'axios';

export const createOrder = (order: any) => async (dispatch: any, getState: any) => {
	try {
		dispatch({
			type: actions.ORDER_CREATE_REQUEST,
		})

		const {
			userLogin: { userInfo },
            cart: { guestInfo }
		} = getState()

        const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

        if (userInfo && userInfo.token) {
             // @ts-ignore
             config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        
        // Inject guestInfo into order object if exists and no user
        const orderData = {
            ...order,
            guestInfo: (!userInfo && guestInfo) ? guestInfo : undefined
        };

		const { data } = await axios.post(
			'/api/orders',
			orderData,
			config
		)

		dispatch({
			type: actions.ORDER_CREATE_SUCCESS,
			payload: data,
		})
	} catch (error: any) {
		dispatch({
			type: actions.ORDER_CREATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const getOrderDetails = (id: string) => async (dispatch: any, getState: any) => {
	try {
		dispatch({
			type: actions.ORDER_DETAILS_REQUEST,
		})

		const {
			userLogin: {
				userInfo: { token },
			},
		} = getState()

		const config = {
			headers: {
				'Authorization': `Bearer ${token}`
			},
		}

		const { data } = await axios.get(
			`/api/orders/${id}`,
			config
		)

		dispatch({
			type: actions.ORDER_DETAILS_SUCCESS,
			payload: data,
		})
	} catch (error: any) {
		dispatch({
			type: actions.ORDER_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const payOrder = (orderId: string, paymentResult: any) => async (dispatch: any, getState: any) => {
	try {
		dispatch({
			type: actions.ORDER_PAY_REQUEST,
		})

		const {
			userLogin: {
				userInfo: { token },
			},
		} = getState()

		const config = {
            headers: {
				'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
			},
		}

		const { data } = await axios.put(
			`/api/orders/${orderId}/pay`,
            paymentResult,
			config
		)

		dispatch({
			type: actions.ORDER_PAY_SUCCESS,
			payload: data,
		})
	} catch (error: any) {
		dispatch({
			type: actions.ORDER_PAY_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const listMyOrders = () => async (dispatch: any, getState: any) => {
	try {
		dispatch({
			type: actions.ORDER_LIST_MY_REQUEST,
		})

		const {
			userLogin: {
				userInfo: { token },
			},
		} = getState()

		const config = {
			headers: {
				'Authorization': `Bearer ${token}`
			},
		}

		const { data } = await axios.get(
			`/api/orders/myorders`,
			config
		)

		dispatch({
			type: actions.ORDER_LIST_MY_SUCCESS,
			payload: data,
		})
	} catch (error: any) {
		dispatch({
			type: actions.ORDER_LIST_MY_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const listOrders = () => async (dispatch: any, getState: any) => {
	try {
		dispatch({
			type: actions.ORDER_LIST_REQUEST,
		})

		const {
			userLogin: {
				userInfo: { token },
			},
		} = getState()

		const config = {
			headers: {
				'Authorization': `Bearer ${token}`
			},
		}

		const { data } = await axios.get(
			`/api/orders`,
			config
		)

		dispatch({
			type: actions.ORDER_LIST_SUCCESS,
			payload: data,
		})
	} catch (error: any) {
		dispatch({
			type: actions.ORDER_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const deliverOrder = (order: any) => async (dispatch: any, getState: any) => {
	try {
		dispatch({
			type: actions.ORDER_DELIVER_REQUEST,
		})

		const {
			userLogin: {
				userInfo: { token },
			},
		} = getState()

		const config = {
			headers: {
				'Authorization': `Bearer ${token}`
			},
		}

		const { data } = await axios.put(
			`/api/orders/${order._id}/deliver`,
            {},
			config
		)

		dispatch({
			type: actions.ORDER_DELIVER_SUCCESS,
			payload: data,
		})
	} catch (error: any) {
		dispatch({
			type: actions.ORDER_DELIVER_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}
