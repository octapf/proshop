import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import axios from 'axios';
import * as actions from '../../src/redux/actions/productActions';
import * as types from '../../src/redux/constants/productConstants';

const middlewares: any = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('axios');

describe('productActions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      userLogin: { userInfo: { token: 'test-token' } },
    });
    jest.clearAllMocks();
  });

  describe('listProducts', () => {
    it('creates PRODUCT_LIST_SUCCESS when fetching products has been done', async () => {
      const data = { products: [{ id: 1 }], pages: 1, page: 1 };
      (axios.get as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: types.PRODUCT_LIST_REQUEST },
        { type: types.PRODUCT_LIST_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.listProducts());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates PRODUCT_LIST_FAIL when fetching products fails', async () => {
      const error = { response: { data: { message: 'Error' } } };
      (axios.get as jest.Mock).mockRejectedValue(error);

      const expectedActions = [
        { type: types.PRODUCT_LIST_REQUEST },
        { type: types.PRODUCT_LIST_FAIL, payload: 'Error' },
      ];

      await store.dispatch(actions.listProducts());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('handles query parameters correctly', async () => {
      const data = { products: [] };
      (axios.get as jest.Mock).mockResolvedValue({ data });

      await store.dispatch(
        actions.listProducts('iphone', '1', { category: 'elec', brand: 'apple' })
      );

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('keyword=iphone'));
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('pageNumber=1'));
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('category=elec'));
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('brand=apple'));
    });
  });

  describe('listProductFilters', () => {
    it('creates PRODUCT_FILTERS_SUCCESS on success', async () => {
      const data = { categories: [], brands: [], maxPrice: 100 };
      (axios.get as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: types.PRODUCT_FILTERS_REQUEST },
        { type: types.PRODUCT_FILTERS_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.listProductFilters());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates PRODUCT_FILTERS_FAIL on failure', async () => {
      const message = 'Filter Error';
      (axios.get as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: types.PRODUCT_FILTERS_REQUEST },
        { type: types.PRODUCT_FILTERS_FAIL, payload: message },
      ];

      await store.dispatch(actions.listProductFilters());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('listProductDetails', () => {
    it('creates PRODUCT_SINGLE_SUCCESS on success', async () => {
      const data = { id: 1, name: 'Product' };
      (axios.get as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: types.PRODUCT_SINGLE_REQUEST },
        { type: types.PRODUCT_SINGLE_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.listProductDetails('1'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates PRODUCT_SINGLE_FAIL on failure', async () => {
      const error = { response: { data: { message: 'Not Found' } } };
      (axios.get as jest.Mock).mockRejectedValue(error);

      const expectedActions = [
        { type: types.PRODUCT_SINGLE_REQUEST },
        { type: types.PRODUCT_SINGLE_FAIL, payload: 'Not Found' },
      ];

      await store.dispatch(actions.listProductDetails('1'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('deleteProduct', () => {
    it('creates PRODUCT_DELETE_SUCCESS on success', async () => {
      (axios.delete as jest.Mock).mockResolvedValue({});

      const expectedActions = [
        { type: types.PRODUCT_DELETE_REQUEST },
        { type: types.PRODUCT_DELETE_SUCCESS },
      ];

      await store.dispatch(actions.deleteProduct('1'));
      expect(store.getActions()).toEqual(expectedActions);
      expect(axios.delete).toHaveBeenCalledWith(
        '/api/products/1',
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' },
        })
      );
    });

    it('creates PRODUCT_DELETE_FAIL on failure', async () => {
      const message = 'Delete failed';
      (axios.delete as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: types.PRODUCT_DELETE_REQUEST },
        { type: types.PRODUCT_DELETE_FAIL, payload: message },
      ];

      await store.dispatch(actions.deleteProduct('1'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('createProduct', () => {
    it('creates PRODUCT_CREATE_SUCCESS on success', async () => {
      const data = { id: 2, name: 'New' };
      (axios.post as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: types.PRODUCT_CREATE_REQUEST },
        { type: types.PRODUCT_CREATE_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.createProduct());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates PRODUCT_CREATE_FAIL on failure', async () => {
      const message = 'Create failed';
      (axios.post as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: types.PRODUCT_CREATE_REQUEST },
        { type: types.PRODUCT_CREATE_FAIL, payload: message },
      ];

      await store.dispatch(actions.createProduct());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('updateProduct', () => {
    it('creates PRODUCT_UPDATE_SUCCESS and PRODUCT_SINGLE_SUCCESS on success', async () => {
      const product = { _id: '1', name: 'Updated' };
      const data = product;
      (axios.put as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: types.PRODUCT_UPDATE_REQUEST },
        { type: types.PRODUCT_UPDATE_SUCCESS, payload: data },
        { type: types.PRODUCT_SINGLE_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.updateProduct(product));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates PRODUCT_UPDATE_FAIL on failure', async () => {
      const product = { _id: '1', name: 'Updated' };
      const message = 'Update failed';
      (axios.put as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: types.PRODUCT_UPDATE_REQUEST },
        { type: types.PRODUCT_UPDATE_FAIL, payload: message },
      ];

      await store.dispatch(actions.updateProduct(product));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('listRelatedProducts', () => {
    it('creates PRODUCT_RELATED_SUCCESS on success', async () => {
      const data = [{ id: 2 }];
      (axios.get as jest.Mock).mockResolvedValue({ data });

      const expectedActions = [
        { type: types.PRODUCT_RELATED_REQUEST },
        { type: types.PRODUCT_RELATED_SUCCESS, payload: data },
      ];

      await store.dispatch(actions.listRelatedProducts('1'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('creates PRODUCT_RELATED_FAIL on failure', async () => {
      const message = 'Related failed';
      (axios.get as jest.Mock).mockRejectedValue(new Error(message));

      const expectedActions = [
        { type: types.PRODUCT_RELATED_REQUEST },
        { type: types.PRODUCT_RELATED_FAIL, payload: message },
      ];

      await store.dispatch(actions.listRelatedProducts('1'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
