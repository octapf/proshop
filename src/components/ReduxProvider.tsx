'use client';

import { Provider } from 'react-redux';
import store from '@/redux/store';
import { useEffect } from 'react';
import * as userConstants from '@/redux/constants/userConstants';
import * as cartConstants from '@/redux/constants/cartConstants';
import * as wishlistConstants from '@/redux/constants/wishlistConstants';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hydrate User
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo') as string)
      : null;

    if (userInfo) {
      store.dispatch({
        type: userConstants.USER_LOGIN_SUCCESS,
        payload: userInfo,
      });
    }

    // Hydrate Cart
    const cartItems = localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems') as string)
      : [];

    if (cartItems && cartItems.length > 0) {
      cartItems.forEach((item: any) => {
        store.dispatch({
          type: cartConstants.CART_ADD_ITEM,
          payload: item,
        });
      });
    }

    // Hydrate Shipping Address
    const shippingAddress = localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress') as string)
      : {};

    if (Object.keys(shippingAddress).length > 0) {
      store.dispatch({
        type: cartConstants.CART_SAVE_SHIPPING_ADDRESS,
        payload: shippingAddress,
      });
    }

    const guestInfo = localStorage.getItem('guestInfo')
      ? JSON.parse(localStorage.getItem('guestInfo') as string)
      : null;

    if (guestInfo) {
      store.dispatch({
        type: cartConstants.CART_SAVE_GUEST_INFO,
        payload: guestInfo,
      });
    }

    // Hydrate Wishlist
    const wishlistItems = localStorage.getItem('wishlistItems')
      ? JSON.parse(localStorage.getItem('wishlistItems') as string)
      : [];

    if (wishlistItems && wishlistItems.length > 0) {
      wishlistItems.forEach((item: any) => {
        store.dispatch({
          type: wishlistConstants.WISHLIST_ADD_ITEM,
          payload: item,
        });
      });
    }

    // Hydrate Payment Method
    const paymentMethod = localStorage.getItem('paymentMethod')
      ? JSON.parse(localStorage.getItem('paymentMethod') as string)
      : '';

    if (paymentMethod) {
      store.dispatch({
        type: cartConstants.CART_SAVE_PAYMENT_METHOD,
        payload: paymentMethod,
      });
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
