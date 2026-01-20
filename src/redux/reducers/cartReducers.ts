import * as actions from '../constants/cartConstants';

export const cartReducer = (
  state: { cartItems: any[]; shippingAddress: any; paymentMethod: string; guestInfo: any } = {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: '',
    guestInfo: {},
  },
  action: any
) => {
  switch (action.type) {
    case actions.CART_ADD_ITEM:
      const item = action.payload;
      const existItem = state.cartItems.find((x: any) => x.product === item.product);

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x: any) => (x.product === existItem.product ? item : x)),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case actions.CART_REMOVE_ITEM:
      const id = action.payload;

      return {
        ...state,
        cartItems: state.cartItems.filter((x: any) => x.product !== id),
      };

    case actions.CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };

    case actions.CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };

    case actions.CART_SAVE_GUEST_INFO:
      return {
        ...state,
        guestInfo: action.payload,
      };

    case actions.CART_RESET:
      return {
        cartItems: [],
        shippingAddress: {},
        paymentMethod: '',
      };
    default:
      return state;
  }
};
