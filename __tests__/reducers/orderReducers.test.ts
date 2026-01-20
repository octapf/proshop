import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderListMyReducer,
  orderListReducer,
  orderDeliverReducer,
} from '../../src/redux/reducers/orderReducers';
import * as actions from '../../src/redux/constants/orderConstants';

describe('orderReducers', () => {
  describe('orderCreateReducer', () => {
    it('should return default state', () => {
      const state = orderCreateReducer(undefined, { type: '' });
      expect(state).toEqual({ order: {} });
    });

    it('should handle ORDER_CREATE_REQUEST', () => {
      const state = orderCreateReducer(undefined, {
        type: actions.ORDER_CREATE_REQUEST,
      });
      expect(state).toEqual({ order: {}, loading: true, success: false });
    });

    it('should handle ORDER_CREATE_SUCCESS', () => {
      const order = { id: 1, total: 100 };
      const state = orderCreateReducer(undefined, {
        type: actions.ORDER_CREATE_SUCCESS,
        payload: order,
      });
      expect(state).toEqual({ loading: false, success: true, order });
    });

    it('should handle ORDER_CREATE_FAIL', () => {
      const error = 'Order creation failed';
      const state = orderCreateReducer(undefined, {
        type: actions.ORDER_CREATE_FAIL,
        payload: error,
      });
      expect(state).toEqual({
        order: {},
        loading: false,
        success: false,
        error,
        validationErrors: null,
      });
    });
  });

  describe('orderDetailsReducer', () => {
    const initialState = {
      loading: true,
      order: { orderItems: [], shippingAddress: {}, user: {} },
    };

    it('should return default state', () => {
      const state = orderDetailsReducer(undefined, { type: '' });
      expect(state).toEqual(initialState);
    });

    it('should handle ORDER_DETAILS_REQUEST', () => {
      const state = orderDetailsReducer(undefined, {
        type: actions.ORDER_DETAILS_REQUEST,
      });
      expect(state).toEqual({ ...initialState, loading: true });
    });

    it('should handle ORDER_DETAILS_SUCCESS', () => {
      const order = { id: 1, items: [] };
      const state = orderDetailsReducer(undefined, {
        type: actions.ORDER_DETAILS_SUCCESS,
        payload: order,
      });
      expect(state).toEqual({ loading: false, order });
    });

    it('should handle ORDER_DETAILS_FAIL', () => {
      const error = 'Fetch order failed';
      const state = orderDetailsReducer(undefined, {
        type: actions.ORDER_DETAILS_FAIL,
        payload: error,
      });
      expect(state).toEqual({ ...initialState, loading: false, error });
    });

    it('should handle ORDER_DETAILS_RESET', () => {
      const state = orderDetailsReducer(undefined, {
        type: actions.ORDER_DETAILS_RESET,
      });
      expect(state).toEqual(initialState);
    });
  });

  describe('orderPayReducer', () => {
    it('should return default state', () => {
      const state = orderPayReducer(undefined, { type: '' });
      expect(state).toEqual({});
    });

    it('should handle ORDER_PAY_REQUEST', () => {
      const state = orderPayReducer(undefined, {
        type: actions.ORDER_PAY_REQUEST,
      });
      expect(state).toEqual({ loading: true });
    });

    it('should handle ORDER_PAY_SUCCESS', () => {
      const state = orderPayReducer(undefined, {
        type: actions.ORDER_PAY_SUCCESS,
      });
      expect(state).toEqual({ loading: false, success: true });
    });

    it('should handle ORDER_PAY_FAIL', () => {
      const error = 'Pay failed';
      const state = orderPayReducer(undefined, {
        type: actions.ORDER_PAY_FAIL,
        payload: error,
      });
      expect(state).toEqual({ loading: false, error });
    });

    it('should handle ORDER_PAY_RESET', () => {
      const state = orderPayReducer(undefined, {
        type: actions.ORDER_PAY_RESET,
      });
      expect(state).toEqual({});
    });
  });

  describe('orderListMyReducer', () => {
    it('should return default state', () => {
      const state = orderListMyReducer(undefined, { type: '' });
      expect(state).toEqual({ orders: [] });
    });

    it('should handle ORDER_LIST_MY_REQUEST', () => {
      const state = orderListMyReducer(undefined, {
        type: actions.ORDER_LIST_MY_REQUEST,
      });
      expect(state).toEqual({ orders: [], loading: true });
    });

    it('should handle ORDER_LIST_MY_SUCCESS', () => {
      const orders = [{ id: 1 }];
      const state = orderListMyReducer(undefined, {
        type: actions.ORDER_LIST_MY_SUCCESS,
        payload: orders,
      });
      expect(state).toEqual({ loading: false, orders });
    });

    it('should handle ORDER_LIST_MY_FAIL', () => {
      const error = 'List failed';
      const state = orderListMyReducer(undefined, {
        type: actions.ORDER_LIST_MY_FAIL,
        payload: error,
      });
      expect(state).toEqual({ orders: [], loading: false, error });
    });

    it('should handle ORDER_LIST_MY_RESET', () => {
      const state = orderListMyReducer(undefined, {
        type: actions.ORDER_LIST_MY_RESET,
      });
      expect(state).toEqual({ orders: [] });
    });
  });

  describe('orderListReducer', () => {
    it('should return default state', () => {
      const state = orderListReducer(undefined, { type: '' });
      expect(state).toEqual({ orders: [] });
    });

    it('should handle ORDER_LIST_REQUEST', () => {
      const state = orderListReducer(undefined, {
        type: actions.ORDER_LIST_REQUEST,
      });
      expect(state).toEqual({ loading: true });
    });

    it('should handle ORDER_LIST_SUCCESS', () => {
      const orders = [{ id: 1 }];
      const state = orderListReducer(undefined, {
        type: actions.ORDER_LIST_SUCCESS,
        payload: orders,
      });
      expect(state).toEqual({ loading: false, orders });
    });

    it('should handle ORDER_LIST_FAIL', () => {
      const error = 'List all failed';
      const state = orderListReducer(undefined, {
        type: actions.ORDER_LIST_FAIL,
        payload: error,
      });
      expect(state).toEqual({ loading: false, error });
    });
  });

  describe('orderDeliverReducer', () => {
    it('should return default state', () => {
      const state = orderDeliverReducer(undefined, { type: '' });
      expect(state).toEqual({});
    });

    it('should handle ORDER_DELIVER_REQUEST', () => {
      const state = orderDeliverReducer(undefined, {
        type: actions.ORDER_DELIVER_REQUEST,
      });
      expect(state).toEqual({ loading: true });
    });

    it('should handle ORDER_DELIVER_SUCCESS', () => {
      const state = orderDeliverReducer(undefined, {
        type: actions.ORDER_DELIVER_SUCCESS,
      });
      expect(state).toEqual({ loading: false, success: true });
    });

    it('should handle ORDER_DELIVER_FAIL', () => {
      const error = 'Deliver failed';
      const state = orderDeliverReducer(undefined, {
        type: actions.ORDER_DELIVER_FAIL,
        payload: error,
      });
      expect(state).toEqual({ loading: false, error });
    });

    it('should handle ORDER_DELIVER_RESET', () => {
      const state = orderDeliverReducer(undefined, {
        type: actions.ORDER_DELIVER_RESET,
      });
      expect(state).toEqual({});
    });
  });
});
