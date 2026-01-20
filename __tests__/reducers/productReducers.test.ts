import {
  productListReducer,
  getProductReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
  productRelatedReducer,
  productFiltersReducer,
} from '../../src/redux/reducers/productReducers';
import * as actions from '../../src/redux/constants/productConstants';

describe('productReducers', () => {
  describe('productListReducer', () => {
    it('should return default state', () => {
      const state = productListReducer(undefined, { type: '' });
      expect(state).toEqual({ products: [] });
    });

    it('should handle PRODUCT_LIST_REQUEST', () => {
      const state = productListReducer(undefined, {
        type: actions.PRODUCT_LIST_REQUEST,
      });
      expect(state).toEqual({ loading: true, products: [] });
    });

    it('should handle PRODUCT_LIST_SUCCESS', () => {
      const payload = { products: ['p1', 'p2'], pages: 2, page: 1 };
      const state = productListReducer(undefined, {
        type: actions.PRODUCT_LIST_SUCCESS,
        payload,
      });
      expect(state).toEqual({
        loading: false,
        products: payload.products,
        pages: payload.pages,
        page: payload.page,
      });
    });

    it('should handle PRODUCT_LIST_FAIL', () => {
      const error = 'Error fetching products';
      const state = productListReducer(undefined, {
        type: actions.PRODUCT_LIST_FAIL,
        payload: error,
      });
      expect(state).toEqual({
        products: [],
        loading: false,
        error,
      });
    });
  });

  describe('getProductReducer', () => {
    it('should return default state', () => {
      const state = getProductReducer(undefined, { type: '' });
      expect(state).toEqual({ product: { reviews: [] } });
    });

    it('should handle PRODUCT_SINGLE_REQUEST', () => {
      const state = getProductReducer(undefined, {
        type: actions.PRODUCT_SINGLE_REQUEST,
      });
      expect(state).toEqual({ product: { reviews: [] }, loading: true });
    });

    it('should handle PRODUCT_SINGLE_SUCCESS', () => {
      const product = { id: 1, name: 'Product' };
      const state = getProductReducer(undefined, {
        type: actions.PRODUCT_SINGLE_SUCCESS,
        payload: product,
      });
      expect(state).toEqual({ loading: false, product });
    });

    it('should handle PRODUCT_SINGLE_FAIL', () => {
      const error = 'Error fetching product';
      const state = getProductReducer(undefined, {
        type: actions.PRODUCT_SINGLE_FAIL,
        payload: error,
      });
      expect(state).toEqual({
        product: { reviews: [] },
        loading: false,
        error,
      });
    });
  });

  describe('productDeleteReducer', () => {
    it('should return default state', () => {
      const state = productDeleteReducer(undefined, { type: '' });
      expect(state).toEqual({});
    });

    it('should handle PRODUCT_DELETE_REQUEST', () => {
      const state = productDeleteReducer(undefined, {
        type: actions.PRODUCT_DELETE_REQUEST,
      });
      expect(state).toEqual({ loading: true });
    });

    it('should handle PRODUCT_DELETE_SUCCESS', () => {
      const state = productDeleteReducer(undefined, {
        type: actions.PRODUCT_DELETE_SUCCESS,
      });
      expect(state).toEqual({ loading: false, success: true });
    });

    it('should handle PRODUCT_DELETE_FAIL', () => {
      const error = 'Delete failed';
      const state = productDeleteReducer(undefined, {
        type: actions.PRODUCT_DELETE_FAIL,
        payload: error,
      });
      expect(state).toEqual({ loading: false, error });
    });
  });

  describe('productCreateReducer', () => {
    it('should return default state', () => {
      const state = productCreateReducer(undefined, { type: '' });
      expect(state).toEqual({});
    });

    it('should handle PRODUCT_CREATE_REQUEST', () => {
      const state = productCreateReducer(undefined, {
        type: actions.PRODUCT_CREATE_REQUEST,
      });
      expect(state).toEqual({ loading: true });
    });

    it('should handle PRODUCT_CREATE_SUCCESS', () => {
      const product = { id: 1, name: 'New Product' };
      const state = productCreateReducer(undefined, {
        type: actions.PRODUCT_CREATE_SUCCESS,
        payload: product,
      });
      expect(state).toEqual({ loading: false, success: true, product });
    });

    it('should handle PRODUCT_CREATE_FAIL', () => {
      const error = 'Create failed';
      const state = productCreateReducer(undefined, {
        type: actions.PRODUCT_CREATE_FAIL,
        payload: error,
      });
      expect(state).toEqual({ loading: false, error });
    });

    it('should handle PRODUCT_CREATE_RESET', () => {
      const state = productCreateReducer(
        { loading: false, success: true },
        {
          type: actions.PRODUCT_CREATE_RESET,
        }
      );
      expect(state).toEqual({});
    });
  });

  describe('productUpdateReducer', () => {
    it('should return default state', () => {
      const state = productUpdateReducer(undefined, { type: '' });
      expect(state).toEqual({ product: {} });
    });

    it('should handle PRODUCT_UPDATE_REQUEST', () => {
      const state = productUpdateReducer(undefined, {
        type: actions.PRODUCT_UPDATE_REQUEST,
      });
      expect(state).toEqual({ loading: true });
    });

    it('should handle PRODUCT_UPDATE_SUCCESS', () => {
      const product = { id: 1, name: 'Updated Product' };
      const state = productUpdateReducer(undefined, {
        type: actions.PRODUCT_UPDATE_SUCCESS,
        payload: product,
      });
      expect(state).toEqual({ loading: false, success: true, product });
    });

    it('should handle PRODUCT_UPDATE_FAIL', () => {
      const error = 'Update failed';
      const state = productUpdateReducer(undefined, {
        type: actions.PRODUCT_UPDATE_FAIL,
        payload: error,
      });
      expect(state).toEqual({ loading: false, error });
    });

    it('should handle PRODUCT_UPDATE_RESET', () => {
      const state = productUpdateReducer(
        { loading: false, success: true },
        {
          type: actions.PRODUCT_UPDATE_RESET,
        }
      );
      expect(state).toEqual({ product: {} });
    });
  });

  describe('productReviewCreateReducer', () => {
    it('should return default state', () => {
      const state = productReviewCreateReducer(undefined, { type: '' });
      expect(state).toEqual({});
    });

    it('should handle PRODUCT_CREATE_REVIEW_REQUEST', () => {
      const state = productReviewCreateReducer(undefined, {
        type: actions.PRODUCT_CREATE_REVIEW_REQUEST,
      });
      expect(state).toEqual({ loading: true });
    });

    it('should handle PRODUCT_CREATE_REVIEW_SUCCESS', () => {
      const state = productReviewCreateReducer(undefined, {
        type: actions.PRODUCT_CREATE_REVIEW_SUCCESS,
      });
      expect(state).toEqual({ loading: false, success: true });
    });

    it('should handle PRODUCT_CREATE_REVIEW_FAIL', () => {
      const error = 'Start review failed';
      const state = productReviewCreateReducer(undefined, {
        type: actions.PRODUCT_CREATE_REVIEW_FAIL,
        payload: error,
      });
      expect(state).toEqual({ loading: false, error });
    });

    it('should handle PRODUCT_CREATE_REVIEW_RESET', () => {
      const state = productReviewCreateReducer(
        { loading: false, success: true },
        {
          type: actions.PRODUCT_CREATE_REVIEW_RESET,
        }
      );
      expect(state).toEqual({});
    });
  });

  describe('productTopRatedReducer', () => {
    it('should return default state', () => {
      const state = productTopRatedReducer(undefined, { type: '' });
      expect(state).toEqual({ products: [] });
    });

    it('should handle PRODUCT_TOP_REQUEST', () => {
      const state = productTopRatedReducer(undefined, {
        type: actions.PRODUCT_TOP_REQUEST,
      });
      expect(state).toEqual({ loading: true, products: [] });
    });

    it('should handle PRODUCT_TOP_SUCCESS', () => {
      const products = [{ id: 1, rating: 5 }];
      const state = productTopRatedReducer(undefined, {
        type: actions.PRODUCT_TOP_SUCCESS,
        payload: products,
      });
      expect(state).toEqual({ loading: false, products });
    });

    it('should handle PRODUCT_TOP_FAIL', () => {
      const error = 'Top products failed';
      const state = productTopRatedReducer(undefined, {
        type: actions.PRODUCT_TOP_FAIL,
        payload: error,
      });
      expect(state).toEqual({ loading: false, error });
    });
  });

  describe('productRelatedReducer', () => {
    it('should return default state', () => {
      const state = productRelatedReducer(undefined, { type: '' });
      expect(state).toEqual({ products: [] });
    });

    it('should handle PRODUCT_RELATED_REQUEST', () => {
      const state = productRelatedReducer(undefined, {
        type: actions.PRODUCT_RELATED_REQUEST,
      });
      expect(state).toEqual({ loading: true, products: [] });
    });

    it('should handle PRODUCT_RELATED_SUCCESS', () => {
      const products = [{ id: 2, name: 'Related' }];
      const state = productRelatedReducer(undefined, {
        type: actions.PRODUCT_RELATED_SUCCESS,
        payload: products,
      });
      expect(state).toEqual({ loading: false, products });
    });

    it('should handle PRODUCT_RELATED_FAIL', () => {
      const error = 'Related products failed';
      const state = productRelatedReducer(undefined, {
        type: actions.PRODUCT_RELATED_FAIL,
        payload: error,
      });
      expect(state).toEqual({ loading: false, error });
    });
  });

  describe('productFiltersReducer', () => {
    it('should return default state', () => {
      const state = productFiltersReducer(undefined, { type: '' });
      expect(state).toEqual({ filters: { categories: [], brands: [], maxPrice: 0 } });
    });

    it('should handle PRODUCT_FILTERS_REQUEST', () => {
      const state = productFiltersReducer(undefined, {
        type: actions.PRODUCT_FILTERS_REQUEST,
      });
      expect(state).toEqual({
        loading: true,
        filters: { categories: [], brands: [], maxPrice: 0 },
      });
    });

    it('should handle PRODUCT_FILTERS_SUCCESS', () => {
      const filters = { categories: ['cat1'], brands: ['brand1'], maxPrice: 100 };
      const state = productFiltersReducer(undefined, {
        type: actions.PRODUCT_FILTERS_SUCCESS,
        payload: filters,
      });
      expect(state).toEqual({ loading: false, filters });
    });

    it('should handle PRODUCT_FILTERS_FAIL', () => {
      const error = 'Filters failed';
      const state = productFiltersReducer(undefined, {
        type: actions.PRODUCT_FILTERS_FAIL,
        payload: error,
      });
      expect(state).toEqual({
        loading: false,
        error,
      });
    });
  });
});
