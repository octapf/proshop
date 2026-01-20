import * as actions from '../constants/productConstants';

interface Action {
  type: string;
  payload?: any;
}

export const productListReducer = (state = { products: [] }, action: Action) => {
  switch (action.type) {
    case actions.PRODUCT_LIST_REQUEST:
      return { ...state, loading: true, products: [] };
    case actions.PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
        pages: action.payload.pages,
        page: action.payload.page,
      };
    case actions.PRODUCT_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const getProductReducer = (state = { product: { reviews: [] } }, action: Action) => {
  switch (action.type) {
    case actions.PRODUCT_SINGLE_REQUEST:
      return { ...state, loading: true };
    case actions.PRODUCT_SINGLE_SUCCESS:
      return { loading: false, product: action.payload };
    case actions.PRODUCT_SINGLE_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productDeleteReducer = (state = {}, action: Action) => {
  switch (action.type) {
    case actions.PRODUCT_DELETE_REQUEST:
      return { loading: true };
    case actions.PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case actions.PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productCreateReducer = (state = {}, action: Action) => {
  switch (action.type) {
    case actions.PRODUCT_CREATE_REQUEST:
      return { loading: true };
    case actions.PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case actions.PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case actions.PRODUCT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const productUpdateReducer = (state = { product: {} }, action: Action) => {
  switch (action.type) {
    case actions.PRODUCT_UPDATE_REQUEST:
      return { loading: true };
    case actions.PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case actions.PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case actions.PRODUCT_UPDATE_RESET:
      return { product: {} };
    default:
      return state;
  }
};

export const productReviewCreateReducer = (state = {}, action: Action) => {
  switch (action.type) {
    case actions.PRODUCT_CREATE_REVIEW_REQUEST:
      return { loading: true };
    case actions.PRODUCT_CREATE_REVIEW_SUCCESS:
      return { loading: false, success: true };
    case actions.PRODUCT_CREATE_REVIEW_FAIL:
      return { loading: false, error: action.payload };
    case actions.PRODUCT_CREATE_REVIEW_RESET:
      return {};
    default:
      return state;
  }
};

export const productTopRatedReducer = (state = { products: [] }, action: Action) => {
  switch (action.type) {
    case actions.PRODUCT_TOP_REQUEST:
      return { loading: true, products: [] };
    case actions.PRODUCT_TOP_SUCCESS:
      return { loading: false, products: action.payload };
    case actions.PRODUCT_TOP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productRelatedReducer = (state = { products: [] }, action: Action) => {
  switch (action.type) {
    case actions.PRODUCT_RELATED_REQUEST:
      return { loading: true, products: [] };
    case actions.PRODUCT_RELATED_SUCCESS:
      return { loading: false, products: action.payload };
    case actions.PRODUCT_RELATED_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productFiltersReducer = (
  state = { filters: { categories: [], brands: [], maxPrice: 0 } },
  action: Action
) => {
  switch (action.type) {
    case actions.PRODUCT_FILTERS_REQUEST:
      return { loading: true, filters: { categories: [], brands: [], maxPrice: 0 } };
    case actions.PRODUCT_FILTERS_SUCCESS:
      return { loading: false, filters: action.payload };
    case actions.PRODUCT_FILTERS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
