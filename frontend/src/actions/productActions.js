import axios from 'axios'
import * as actions from '../constants/productConstants'

export const listProducts = () => async (dispatch) => {
	try {
		dispatch({ type: actions.PRODUCT_LIST_REQUEST })
		const { data } = await axios.get('/api/products')
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
		dispatch({ type: actions.SINGLE_PRODUCT_REQUEST })
		const { data } = await axios.get(`/api/products/${id}`)

		dispatch({ type: actions.SINGLE_PRODUCT_SUCCESS, payload: data })
	} catch (error) {
		dispatch({
			type: actions.SINGLE_PRODUCT_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}
