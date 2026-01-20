import axios from 'axios';
import * as actions from '../constants/cartConstants';

export const addToCart = (id: string, qty: number) => async (dispatch: any, getState: any) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: actions.CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id: string) => async (dispatch: any, getState: any) => {
  dispatch({ type: actions.CART_REMOVE_ITEM, payload: id });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data: any) => (dispatch: any) => {
  dispatch({ type: actions.CART_SAVE_SHIPPING_ADDRESS, payload: data });

  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const savePaymentMethod = (data: any) => (dispatch: any) => {
  dispatch({ type: actions.CART_SAVE_PAYMENT_METHOD, payload: data });

  localStorage.setItem('paymentMethod', JSON.stringify(data));
};

export const saveGuestInfo = (data: any) => (dispatch: any) => {
  dispatch({ type: actions.CART_SAVE_GUEST_INFO, payload: data });
  localStorage.setItem('guestInfo', JSON.stringify(data));
};
