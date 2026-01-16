import * as actions from '../constants/wishlistConstants'

export const wishlistReducer = (state = { wishlistItems: [] as any[] }, action: any) => {
	switch (action.type) {
		case actions.WISHLIST_ADD_ITEM:
			const item = action.payload
			const existItem = state.wishlistItems.find((x: any) => x.product === item.product)

			if (existItem) {
				return {
					...state,
					wishlistItems: state.wishlistItems.map((x: any) =>
						x.product === existItem.product ? item : x
					),
				}
			} else {
				return {
					...state,
					wishlistItems: [...state.wishlistItems, item],
				}
			}

		case actions.WISHLIST_REMOVE_ITEM:
			return {
				...state,
				wishlistItems: state.wishlistItems.filter((x: any) => x.product !== action.payload),
			}

        case actions.WISHLIST_CLEAR_ITEMS:
            return {
                ...state,
                wishlistItems: []
            }

		default:
			return state
	}
}
