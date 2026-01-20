import axios from 'axios';
import * as actions from '../constants/productConstants';

export const listProducts =
  (keyword = '', pageNumber = '', filters = {}) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: actions.PRODUCT_LIST_REQUEST });

      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (pageNumber) params.append('pageNumber', pageNumber);

      // @ts-ignore
      if (filters.category) params.append('category', filters.category);
      // @ts-ignore
      if (filters.brand) params.append('brand', filters.brand);
      // @ts-ignore
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      // @ts-ignore
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      // @ts-ignore
      if (filters.rating) params.append('rating', filters.rating);

      const { data } = await axios.get(`/api/products?${params.toString()}`);

      dispatch({ type: actions.PRODUCT_LIST_SUCCESS, payload: data });
    } catch (error: any) {
      dispatch({
        type: actions.PRODUCT_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listProductFilters = () => async (dispatch: any) => {
  try {
    dispatch({ type: actions.PRODUCT_FILTERS_REQUEST });
    const { data } = await axios.get(`/api/products/filters`);
    dispatch({ type: actions.PRODUCT_FILTERS_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: actions.PRODUCT_FILTERS_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const listProductDetails = (id: string) => async (dispatch: any) => {
  try {
    dispatch({ type: actions.PRODUCT_SINGLE_REQUEST });
    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({ type: actions.PRODUCT_SINGLE_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: actions.PRODUCT_SINGLE_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const getProduct = listProductDetails;

export const deleteProduct = (id: string) => async (dispatch: any, getState: any) => {
  try {
    dispatch({
      type: actions.PRODUCT_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/products/${id}`, config);

    dispatch({
      type: actions.PRODUCT_DELETE_SUCCESS,
    });
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({
      type: actions.PRODUCT_DELETE_FAIL,
      payload: message,
    });
  }
};

export const createProduct = () => async (dispatch: any, getState: any) => {
  try {
    dispatch({
      type: actions.PRODUCT_CREATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/products`, {}, config);

    dispatch({
      type: actions.PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({
      type: actions.PRODUCT_CREATE_FAIL,
      payload: message,
    });
  }
};

export const updateProduct = (product: any) => async (dispatch: any, getState: any) => {
  try {
    dispatch({
      type: actions.PRODUCT_UPDATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/products/${product._id}`, product, config);

    dispatch({
      type: actions.PRODUCT_UPDATE_SUCCESS,
      payload: data,
    });
    dispatch({ type: actions.PRODUCT_SINGLE_SUCCESS, payload: data });
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({
      type: actions.PRODUCT_UPDATE_FAIL,
      payload: message,
    });
  }
};

export const listRelatedProducts = (id: string) => async (dispatch: any) => {
  try {
    dispatch({ type: actions.PRODUCT_RELATED_REQUEST });
    const { data } = await axios.get(`/api/products/${id}/related`);

    dispatch({ type: actions.PRODUCT_RELATED_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: actions.PRODUCT_RELATED_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
