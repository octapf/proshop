import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import axios from 'axios';
import * as actions from '../../src/redux/actions/userActions';
import * as userConstants from '../../src/redux/constants/userConstants';
import * as cartConstants from '../../src/redux/constants/cartConstants';

const middlewares: any = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('axios');

describe('userActions', () => {
  let store: any;
  let localStorageMock: any;

  beforeEach(() => {
    store = mockStore({
      userLogin: { userInfo: { token: 'test-token' } },
    });

    localStorageMock = (function () {
      let store: any = {};
      return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value.toString();
        }),
        clear: jest.fn(() => {
          store = {};
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key];
        }),
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('creates USER_LOGIN_SUCCESS on success', async () => {
      const data = { _id: '1', name: 'User' };
      (axios.post as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: userConstants.USER_LOGIN_REQUEST },
        { type: userConstants.USER_LOGIN_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.login('test@test.com', 'password'));
      expect(store.getActions()).toEqual(expectedActions);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('userInfo', JSON.stringify(data));
    });

    it('creates USER_LOGIN_FAIL on failure', async () => {
      const message = 'Login failed';
      (axios.post as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: userConstants.USER_LOGIN_REQUEST },
        { type: userConstants.USER_LOGIN_FAIL, payload: message },
      ];

      await store.dispatch(actions.login('test@test.com', 'password'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('logout', () => {
    it('removes localStorage items and dispatches logout actions', async () => {
      const expectedActions = [
        { type: userConstants.USER_LOGOUT },
        { type: userConstants.USER_DETAILS_RESET },
        { type: cartConstants.CART_RESET },
      ];

      await store.dispatch(actions.logout());

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userInfo');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cartItems');
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches USER_LOGIN_FAIL on error (unlikely but covered)', async () => {
      // Force an error in localStorage.removeItem to simulate try/catch block coverage
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const expectedActions = [{ type: userConstants.USER_LOGIN_FAIL, payload: 'Storage error' }];

      await store.dispatch(actions.logout());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('register', () => {
    it('creates USER_REGISTER_SUCCESS and USER_LOGIN_SUCCESS on success', async () => {
      const data = { _id: '1', name: 'User' };
      (axios.post as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: userConstants.USER_REGISTER_REQUEST },
        { type: userConstants.USER_REGISTER_SUCCESS, payload: data },
        { type: userConstants.USER_LOGIN_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.register('User', 'test@test.com', 'password'));
      expect(store.getActions()).toEqual(expectedActions);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('userInfo', JSON.stringify(data));
    });

    it('creates USER_REGISTER_FAIL on failure', async () => {
      const message = 'Register failed';
      (axios.post as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: userConstants.USER_REGISTER_REQUEST },
        { type: userConstants.USER_REGISTER_FAIL, payload: message },
      ];

      await store.dispatch(actions.register('User', 'test@test.com', 'password'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('getUserDetails', () => {
    it('creates USER_DETAILS_SUCCESS on success', async () => {
      const data = { _id: '1' };
      (axios.get as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: userConstants.USER_DETAILS_REQUEST },
        { type: userConstants.USER_DETAILS_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.getUserDetails('1'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates USER_DETAILS_FAIL on failure', async () => {
      const message = 'Details failed';
      (axios.get as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: userConstants.USER_DETAILS_REQUEST },
        { type: userConstants.USER_DETAILS_FAIL, payload: message },
      ];

      await store.dispatch(actions.getUserDetails('1'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('updateUserProfile', () => {
    it('creates USER_UPDATE_PROFILE_SUCCESS on success', async () => {
      const data = { _id: '1', name: 'Updated' };
      (axios.put as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: userConstants.USER_UPDATE_PROFILE_REQUEST },
        { type: userConstants.USER_UPDATE_PROFILE_SUCCESS, payload: data },
        { type: userConstants.USER_LOGIN_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.updateUserProfile({}));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates USER_UPDATE_PROFILE_FAIL on failure', async () => {
      const message = 'Update failed';
      (axios.put as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: userConstants.USER_UPDATE_PROFILE_REQUEST },
        { type: userConstants.USER_UPDATE_PROFILE_FAIL, payload: message },
      ];

      await store.dispatch(actions.updateUserProfile({}));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('listUsers', () => {
    it('creates USER_LIST_SUCCESS on success', async () => {
      const data = [{ _id: '1' }];
      (axios.get as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: userConstants.USER_LIST_REQUEST },
        { type: userConstants.USER_LIST_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.listUsers());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates USER_LIST_FAIL on failure', async () => {
      const message = 'List failed';
      (axios.get as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: userConstants.USER_LIST_REQUEST },
        { type: userConstants.USER_LIST_FAIL, payload: message },
      ];

      await store.dispatch(actions.listUsers());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('deleteUser', () => {
    it('creates USER_DELETE_SUCCESS on success', async () => {
      (axios.delete as jest.Mock).mockResolvedValue({});

      const expectedActions = [
        { type: userConstants.USER_DELETE_REQUEST },
        { type: userConstants.USER_DELETE_SUCCESS },
      ];

      await store.dispatch(actions.deleteUser('1'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates USER_DELETE_FAIL on failure', async () => {
      const message = 'Delete failed';
      (axios.delete as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: userConstants.USER_DELETE_REQUEST },
        { type: userConstants.USER_DELETE_FAIL, payload: message },
      ];

      await store.dispatch(actions.deleteUser('1'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('updateUser', () => {
    it('creates USER_UPDATE_SUCCESS on success', async () => {
      const data = { _id: '1' };
      (axios.put as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: userConstants.USER_UPDATE_REQUEST },
        { type: userConstants.USER_UPDATE_SUCCESS },
        { type: userConstants.USER_DETAILS_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.updateUser({ _id: '1' }));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates USER_UPDATE_FAIL on failure', async () => {
      const message = 'Update failed';
      (axios.put as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: userConstants.USER_UPDATE_REQUEST },
        { type: userConstants.USER_UPDATE_FAIL, payload: message },
      ];

      await store.dispatch(actions.updateUser({ _id: '1' }));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
