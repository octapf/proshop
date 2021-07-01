import * as actions from '../constants/productConstants'

export const productListReducer = (state = { products: [] }, action) => {
	switch (action.type) {
		case actions.PRODUCT_LIST_REQUEST:
			return { loading: true, product: [] }
		case actions.PRODUCT_LIST_SUCCESS:
			return { loading: false, products: action.payload }
		case actions.PRODUCT_LIST_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const getProductReducer = (
	state = { product: { reviews: [] } },
	action
) => {
	switch (action.type) {
		case actions.SINGLE_PRODUCT_REQUEST:
			return { loading: true, ...state }
		case actions.SINGLE_PRODUCT_SUCCESS:
			return { loading: false, product: action.payload }
		case actions.SINGLE_PRODUCT_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}
