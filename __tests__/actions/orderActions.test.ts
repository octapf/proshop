import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import axios from 'axios';
import * as actions from '../../src/redux/actions/orderActions';
import * as types from '../../src/redux/constants/orderConstants';

const middlewares: any = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('axios');

describe('orderActions', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      userLogin: { userInfo: { token: 'test-token' } },
      cart: { guestInfo: null },
    });
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('creates ORDER_CREATE_SUCCESS on success (Authenticated)', async () => {
      const order = { items: [] };
      const data = { ...order, _id: '1' };
      (axios.post as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: types.ORDER_CREATE_REQUEST },
        { type: types.ORDER_CREATE_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.createOrder(order));
      expect(store.getActions()).toEqual(expectedActions);
      expect(axios.post).toHaveBeenCalledWith(
        '/api/orders',
        expect.objectContaining({ guestInfo: undefined }),
        expect.anything()
      );
    });

    it('creates ORDER_CREATE_SUCCESS on success (Guest)', async () => {
      store = mockStore({
        userLogin: { userInfo: null },
        cart: { guestInfo: { email: 'guest@test.com' } },
      });

      const order = { items: [] };
      const data = { ...order, _id: '1' };
      (axios.post as jest.Mock).mockResolvedValue({ data });

      await store.dispatch(actions.createOrder(order));

      expect(axios.post).toHaveBeenCalledWith(
        '/api/orders',
        expect.objectContaining({ guestInfo: { email: 'guest@test.com' } }),
        expect.not.objectContaining({
          headers: expect.objectContaining({ Authorization: expect.anything() }),
        })
      );
    });

    it('creates ORDER_CREATE_FAIL on failure', async () => {
      const message = 'Create failed';
      (axios.post as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: types.ORDER_CREATE_REQUEST },
        { type: types.ORDER_CREATE_FAIL, payload: message },
      ];

      await store.dispatch(actions.createOrder({}));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('getOrderDetails', () => {
    it('creates ORDER_DETAILS_SUCCESS on success', async () => {
      const data = { _id: '1' };
      (axios.get as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: types.ORDER_DETAILS_REQUEST },
        { type: types.ORDER_DETAILS_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.getOrderDetails('1'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates ORDER_DETAILS_FAIL on failure', async () => {
      const message = 'Details failed';
      (axios.get as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: types.ORDER_DETAILS_REQUEST },
        { type: types.ORDER_DETAILS_FAIL, payload: message },
      ];

      await store.dispatch(actions.getOrderDetails('1'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('payOrder', () => {
    it('creates ORDER_PAY_SUCCESS on success', async () => {
      const paymentResult = { id: 'pay1' };
      const data = { success: true };
      (axios.put as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: types.ORDER_PAY_REQUEST },
        { type: types.ORDER_PAY_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.payOrder('1', paymentResult));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates ORDER_PAY_FAIL on failure', async () => {
      const message = 'Pay failed';
      (axios.put as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: types.ORDER_PAY_REQUEST },
        { type: types.ORDER_PAY_FAIL, payload: message },
      ];

      await store.dispatch(actions.payOrder('1', {}));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('listMyOrders', () => {
    it('creates ORDER_LIST_MY_SUCCESS on success', async () => {
      const data = [{ _id: '1' }];
      (axios.get as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: types.ORDER_LIST_MY_REQUEST },
        { type: types.ORDER_LIST_MY_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.listMyOrders());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates ORDER_LIST_MY_FAIL on failure', async () => {
      const message = 'List My failed';
      (axios.get as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: types.ORDER_LIST_MY_REQUEST },
        { type: types.ORDER_LIST_MY_FAIL, payload: message },
      ];

      await store.dispatch(actions.listMyOrders());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('listOrders', () => {
    it('creates ORDER_LIST_SUCCESS on success', async () => {
      const data = [{ _id: '1' }];
      (axios.get as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: types.ORDER_LIST_REQUEST },
        { type: types.ORDER_LIST_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.listOrders());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates ORDER_LIST_FAIL on failure', async () => {
      const message = 'List failed';
      (axios.get as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: types.ORDER_LIST_REQUEST },
        { type: types.ORDER_LIST_FAIL, payload: message },
      ];

      await store.dispatch(actions.listOrders());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('deliverOrder', () => {
    it('creates ORDER_DELIVER_SUCCESS on success', async () => {
      const order = { _id: '1' };
      const data = { success: true };
      (axios.put as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: types.ORDER_DELIVER_REQUEST },
        { type: types.ORDER_DELIVER_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.deliverOrder(order));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates ORDER_DELIVER_FAIL on failure', async () => {
      const order = { _id: '1' };
      const message = 'Deliver failed';
      (axios.put as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: types.ORDER_DELIVER_REQUEST },
        { type: types.ORDER_DELIVER_FAIL, payload: message },
      ];

      await store.dispatch(actions.deliverOrder(order));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
