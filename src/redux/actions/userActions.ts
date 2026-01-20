import * as userActions from '../constants/userConstants';
import * as cartActions from '../constants/cartConstants';
import axios from 'axios';

export const login = (email: string, password: string) => async (dispatch: any) => {
  try {
    dispatch({
      type: userActions.USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/users/login',
      {
        email,
        password,
      },
      config
    );

    dispatch({
      type: userActions.USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error: any) {
    dispatch({
      type: userActions.USER_LOGIN_FAIL,
      payload: error.response && error.response.data.message ? error.response.data : error.message,
    });
  }
};

export const logout = () => async (dispatch: any) => {
  try {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('paymentMethod');
    localStorage.removeItem('shippingAddress');

    dispatch({
      type: userActions.USER_LOGOUT,
    });
    dispatch({
      type: userActions.USER_DETAILS_RESET,
    });
    // dispatch({ type: userActions.USER_LIST_RESET })
    // dispatch({
    // 	type: orderActions.ORDER_LIST_MY_RESET,
    // })
    // dispatch({
    // 	type: orderActions.ORDER_DETAILS_RESET,
    // })
    dispatch({
      type: cartActions.CART_RESET,
    });
    // Optional: Redirect to login or home
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (error: any) {
    dispatch({
      type: userActions.USER_LOGIN_FAIL,
      payload: error.response && error.response.data.message ? error.response.data : error.message,
    });
  }
};

export const register =
  (name: string, email: string, password: string) => async (dispatch: any) => {
    try {
      dispatch({
        type: userActions.USER_REGISTER_REQUEST,
      });

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/users',
        {
          name,
          email,
          password,
        },
        config
      );

      dispatch({
        type: userActions.USER_REGISTER_SUCCESS,
        payload: data,
      });

      dispatch({
        type: userActions.USER_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error: any) {
      dispatch({
        type: userActions.USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message ? error.response.data : error.message,
      });
    }
  };

export const getUserDetails = (id: string) => async (dispatch: any, getState: any) => {
  try {
    dispatch({
      type: userActions.USER_DETAILS_REQUEST,
    });

    const {
      userLogin: {
        userInfo: { token },
      },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`/api/users/${id}`, config);

    dispatch({
      type: userActions.USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: userActions.USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const updateUserProfile = (user: any) => async (dispatch: any, getState: any) => {
  try {
    dispatch({
      type: userActions.USER_UPDATE_PROFILE_REQUEST,
    });

    const {
      userLogin: {
        userInfo: { token },
      },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(`/api/users/profile`, user, config);

    dispatch({
      type: userActions.USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    dispatch({
      type: userActions.USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error: any) {
    dispatch({
      type: userActions.USER_UPDATE_PROFILE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data : error.message,
    });
  }
};

export const listUsers = () => async (dispatch: any, getState: any) => {
  try {
    dispatch({
      type: userActions.USER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users`, config);

    dispatch({
      type: userActions.USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: userActions.USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const deleteUser = (id: string) => async (dispatch: any, getState: any) => {
  try {
    dispatch({
      type: userActions.USER_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/users/${id}`, config);

    dispatch({
      type: userActions.USER_DELETE_SUCCESS,
    });
  } catch (error: any) {
    dispatch({
      type: userActions.USER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const updateUser = (user: any) => async (dispatch: any, getState: any) => {
  try {
    dispatch({
      type: userActions.USER_UPDATE_REQUEST,
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

    const { data } = await axios.put(`/api/users/${user._id}`, user, config);

    dispatch({
      type: userActions.USER_UPDATE_SUCCESS,
    });

    dispatch({
      type: userActions.USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: userActions.USER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
