import axios from 'axios';
import * as actions from '../constants/wishlistConstants';

export const addToWishlist = (id: string) => async (dispatch: any, getState: any) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: actions.WISHLIST_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
    },
  });
  localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlist.wishlistItems));
};

export const removeFromWishlist = (id: string) => async (dispatch: any, getState: any) => {
  dispatch({ type: actions.WISHLIST_REMOVE_ITEM, payload: id });
  localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlist.wishlistItems));
};
