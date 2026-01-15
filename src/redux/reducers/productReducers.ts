
import * as actions from '../constants/productConstants'

export const productListReducer = (state = { products: [] }, action: any) => {
	switch (action.type) {
		case actions.PRODUCT_LIST_REQUEST:
			return { ...state, loading: true, products: [] }
		case actions.PRODUCT_LIST_SUCCESS:
			return {
				loading: false,
				products: action.payload.products,
				pages: action.payload.pages,
				page: action.payload.page,
			}
		case actions.PRODUCT_LIST_FAIL:
			return { ...state, loading: false, error: action.payload }
		default:
			return state
	}
}

export const getProductReducer = (
	state = { product: { reviews: [] } },
	action: any
) => {
	switch (action.type) {
		case actions.PRODUCT_SINGLE_REQUEST:
			return { ...state, loading: true }
		case actions.PRODUCT_SINGLE_SUCCESS:
			return { loading: false, product: action.payload }
		case actions.PRODUCT_SINGLE_FAIL:
			return { ...state, loading: false, error: action.payload }

		default:
			return state
	}
}
