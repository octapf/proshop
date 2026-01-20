import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from '../../src/redux/reducers/userReducers';
import * as actions from '../../src/redux/constants/userConstants';

describe('userReducers', () => {
  describe('userLoginReducer', () => {
    it('should return default state', () => {
      const state = userLoginReducer(undefined, { type: '' });
      expect(state).toEqual({ userInfo: null });
    });

    it('should handle USER_LOGIN_REQUEST', () => {
      const state = userLoginReducer(undefined, {
        type: actions.USER_LOGIN_REQUEST,
      });
      expect(state).toEqual({ userInfo: null, loading: true });
    });

    it('should handle USER_LOGIN_SUCCESS', () => {
      const userInfo = { id: 1, name: 'User' };
      const state = userLoginReducer(undefined, {
        type: actions.USER_LOGIN_SUCCESS,
        payload: userInfo,
      });
      expect(state).toEqual({ loading: false, userInfo });
    });

    it('should handle USER_LOGIN_FAIL', () => {
      const error = 'Login failed';
      const state = userLoginReducer(undefined, {
        type: actions.USER_LOGIN_FAIL,
        payload: error,
      });
      expect(state).toEqual({ userInfo: null, loading: false, error });
    });

    it('should handle USER_LOGOUT', () => {
      const state = userLoginReducer(
        { loading: false, userInfo: { id: 1 } },
        {
          type: actions.USER_LOGOUT,
        }
      );
      expect(state).toEqual({ userInfo: null });
    });
  });

  describe('userRegisterReducer', () => {
    it('should return default state', () => {
      const state = userRegisterReducer(undefined, { type: '' });
      expect(state).toEqual({ userInfo: null });
    });

    it('should handle USER_REGISTER_REQUEST', () => {
      const state = userRegisterReducer(undefined, {
        type: actions.USER_REGISTER_REQUEST,
      });
      expect(state).toEqual({ userInfo: null, loading: true });
    });

    it('should handle USER_REGISTER_SUCCESS', () => {
      const userInfo = { id: 1, name: 'User' };
      const state = userRegisterReducer(undefined, {
        type: actions.USER_REGISTER_SUCCESS,
        payload: userInfo,
      });
      expect(state).toEqual({ loading: false, userInfo });
    });

    it('should handle USER_REGISTER_FAIL', () => {
      const error = 'Register failed';
      const state = userRegisterReducer(undefined, {
        type: actions.USER_REGISTER_FAIL,
        payload: error,
      });
      expect(state).toEqual({ userInfo: null, loading: false, error });
    });
  });

  describe('userDetailsReducer', () => {
    it('should return default state', () => {
      const state = userDetailsReducer(undefined, { type: '' });
      expect(state).toEqual({ user: {} });
    });

    it('should handle USER_DETAILS_REQUEST', () => {
      const state = userDetailsReducer(undefined, {
        type: actions.USER_DETAILS_REQUEST,
      });
      expect(state).toEqual({ user: {}, loading: true });
    });

    it('should handle USER_DETAILS_SUCCESS', () => {
      const user = { id: 1, name: 'User' };
      const state = userDetailsReducer(undefined, {
        type: actions.USER_DETAILS_SUCCESS,
        payload: user,
      });
      expect(state).toEqual({ loading: false, user });
    });

    it('should handle USER_DETAILS_FAIL', () => {
      const error = 'Fetch user failed';
      const state = userDetailsReducer(undefined, {
        type: actions.USER_DETAILS_FAIL,
        payload: error,
      });
      expect(state).toEqual({ user: {}, loading: false, error });
    });

    it('should handle USER_DETAILS_RESET', () => {
      const state = userDetailsReducer(undefined, {
        type: actions.USER_DETAILS_RESET,
      });
      expect(state).toEqual({ user: {} });
    });
  });

  describe('userUpdateProfileReducer', () => {
    it('should return default state', () => {
      const state = userUpdateProfileReducer(undefined, { type: '' });
      expect(state).toEqual({ userInfo: {} });
    });

    it('should handle USER_UPDATE_PROFILE_REQUEST', () => {
      const state = userUpdateProfileReducer(undefined, {
        type: actions.USER_UPDATE_PROFILE_REQUEST,
      });
      expect(state).toEqual({ userInfo: {}, loading: true, success: false });
    });

    it('should handle USER_UPDATE_PROFILE_SUCCESS', () => {
      const userInfo = { id: 1, name: 'User' };
      const state = userUpdateProfileReducer(undefined, {
        type: actions.USER_UPDATE_PROFILE_SUCCESS,
        payload: userInfo,
      });
      expect(state).toEqual({ loading: false, success: true, userInfo });
    });

    it('should handle USER_UPDATE_PROFILE_FAIL', () => {
      const error = 'Update failed';
      const state = userUpdateProfileReducer(undefined, {
        type: actions.USER_UPDATE_PROFILE_FAIL,
        payload: error,
      });
      expect(state).toEqual({ userInfo: {}, loading: false, success: false, error });
    });

    it('should handle USER_UPDATE_PROFILE_RESET', () => {
      const state = userUpdateProfileReducer(undefined, {
        type: actions.USER_UPDATE_PROFILE_RESET,
      });
      expect(state).toEqual({ userInfo: {} });
    });
  });

  describe('userListReducer', () => {
    it('should return default state', () => {
      const state = userListReducer(undefined, { type: '' });
      expect(state).toEqual({ users: [] });
    });

    it('should handle USER_LIST_REQUEST', () => {
      const state = userListReducer(undefined, {
        type: actions.USER_LIST_REQUEST,
      });
      expect(state).toEqual({ loading: true });
    });

    it('should handle USER_LIST_SUCCESS', () => {
      const users = [{ id: 1 }];
      const state = userListReducer(undefined, {
        type: actions.USER_LIST_SUCCESS,
        payload: users,
      });
      expect(state).toEqual({ loading: false, users });
    });

    it('should handle USER_LIST_FAIL', () => {
      const error = 'List failed';
      const state = userListReducer(undefined, {
        type: actions.USER_LIST_FAIL,
        payload: error,
      });
      expect(state).toEqual({ loading: false, error });
    });

    it('should handle USER_LIST_RESET', () => {
      const state = userListReducer(undefined, {
        type: actions.USER_LIST_RESET,
      });
      expect(state).toEqual({ users: [] });
    });
  });

  describe('userDeleteReducer', () => {
    it('should return default state', () => {
      const state = userDeleteReducer(undefined, { type: '' });
      expect(state).toEqual({});
    });

    it('should handle USER_DELETE_REQUEST', () => {
      const state = userDeleteReducer(undefined, {
        type: actions.USER_DELETE_REQUEST,
      });
      expect(state).toEqual({ loading: true });
    });

    it('should handle USER_DELETE_SUCCESS', () => {
      const state = userDeleteReducer(undefined, {
        type: actions.USER_DELETE_SUCCESS,
      });
      expect(state).toEqual({ loading: false, success: true });
    });

    it('should handle USER_DELETE_FAIL', () => {
      const error = 'Delete failed';
      const state = userDeleteReducer(undefined, {
        type: actions.USER_DELETE_FAIL,
        payload: error,
      });
      expect(state).toEqual({ loading: false, error });
    });
  });

  describe('userUpdateReducer', () => {
    it('should return default state', () => {
      const state = userUpdateReducer(undefined, { type: '' });
      expect(state).toEqual({ user: {} });
    });

    it('should handle USER_UPDATE_REQUEST', () => {
      const state = userUpdateReducer(undefined, {
        type: actions.USER_UPDATE_REQUEST,
      });
      expect(state).toEqual({ loading: true });
    });

    it('should handle USER_UPDATE_SUCCESS', () => {
      const state = userUpdateReducer(undefined, {
        type: actions.USER_UPDATE_SUCCESS,
      });
      expect(state).toEqual({ loading: false, success: true });
    });

    it('should handle USER_UPDATE_FAIL', () => {
      const error = 'Update failed';
      const state = userUpdateReducer(undefined, {
        type: actions.USER_UPDATE_FAIL,
        payload: error,
      });
      expect(state).toEqual({ loading: false, error });
    });

    it('should handle USER_UPDATE_RESET', () => {
      const state = userUpdateReducer(undefined, {
        type: actions.USER_UPDATE_RESET,
      });
      expect(state).toEqual({ user: {} });
    });
  });
});
