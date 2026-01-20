import * as actions from '../constants/orderConstants';

interface Action {
  type: string;
  payload?: any;
}

export const orderCreateReducer = (state = { order: {} }, action: Action) => {
  switch (action.type) {
    case actions.ORDER_CREATE_REQUEST:
      return { ...state, loading: true, success: false };
    case actions.ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case actions.ORDER_CREATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };

    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = {
    loading: true,
    order: { orderItems: [], shippingAddress: {}, user: {} },
  },
  action: Action
) => {
  switch (action.type) {
    case actions.ORDER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case actions.ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload };
    case actions.ORDER_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };

    case actions.ORDER_DETAILS_RESET:
      return {
        loading: true,
        order: { orderItems: [], shippingAddress: {}, user: {} },
      };

    default:
      return state;
  }
};

export const orderPayReducer = (state = {}, action: Action) => {
  switch (action.type) {
    case actions.ORDER_PAY_REQUEST:
      return { loading: true };

    case actions.ORDER_PAY_SUCCESS:
      return { loading: false, success: true };

    case actions.ORDER_PAY_FAIL:
      return { loading: false, error: action.payload };

    case actions.ORDER_PAY_RESET:
      return {};

    default:
      return state;
  }
};

export const orderListMyReducer = (state = { orders: [] }, action: Action) => {
  switch (action.type) {
    case actions.ORDER_LIST_MY_REQUEST:
      return { ...state, loading: true };
    case actions.ORDER_LIST_MY_SUCCESS:
      return { loading: false, orders: action.payload };
    case actions.ORDER_LIST_MY_FAIL:
      return { ...state, loading: false, error: action.payload };

    case actions.ORDER_LIST_MY_RESET:
      return { orders: [] };

    default:
      return state;
  }
};

export const orderListReducer = (state = { orders: [] }, action: Action) => {
  switch (action.type) {
    case actions.ORDER_LIST_REQUEST:
      return { loading: true };
    case actions.ORDER_LIST_SUCCESS:
      return { loading: false, orders: action.payload };
    case actions.ORDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderDeliverReducer = (state = {}, action: Action) => {
  switch (action.type) {
    case actions.ORDER_DELIVER_REQUEST:
      return { loading: true };
    case actions.ORDER_DELIVER_SUCCESS:
      return { loading: false, success: true };
    case actions.ORDER_DELIVER_FAIL:
      return { loading: false, error: action.payload };
    case actions.ORDER_DELIVER_RESET:
      return {};
    default:
      return state;
  }
};
