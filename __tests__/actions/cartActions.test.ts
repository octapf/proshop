import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import axios from 'axios';
import * as actions from '../../src/redux/actions/cartActions';
import * as types from '../../src/redux/constants/cartConstants';

const middlewares: any = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('axios');

describe('cartActions', () => {
  let store: any;
  let localStorageMock: any;

  beforeEach(() => {
    store = mockStore({
      cart: { cartItems: [] },
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
    });

    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    it('creates CART_ADD_ITEM and saves to localStorage', async () => {
      const product = {
        _id: '1',
        name: 'Product 1',
        image: '/img.jpg',
        price: 100,
        countInStock: 10,
      };
      const qty = 2;

      (axios.get as jest.Mock).mockResolvedValue({ data: product });

      const expectedActions = [
        {
          type: types.CART_ADD_ITEM,
          payload: {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty,
          },
        },
      ];

      await store.dispatch(actions.addToCart(product._id, qty));

      expect(store.getActions()).toEqual(expectedActions);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cartItems', JSON.stringify([]));
    });
  });

  describe('removeFromCart', () => {
    it('creates CART_REMOVE_ITEM and saves to localStorage', async () => {
      const id = '1';

      const expectedActions = [{ type: types.CART_REMOVE_ITEM, payload: id }];

      await store.dispatch(actions.removeFromCart(id));

      expect(store.getActions()).toEqual(expectedActions);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cartItems', JSON.stringify([]));
    });
  });

  describe('saveShippingAddress', () => {
    it('creates CART_SAVE_SHIPPING_ADDRESS and saves to localStorage', () => {
      const data = { address: '123 St', city: 'City' };

      const expectedActions = [{ type: types.CART_SAVE_SHIPPING_ADDRESS, payload: data }];

      store.dispatch(actions.saveShippingAddress(data));

      expect(store.getActions()).toEqual(expectedActions);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'shippingAddress',
        JSON.stringify(data)
      );
    });
  });

  describe('savePaymentMethod', () => {
    it('creates CART_SAVE_PAYMENT_METHOD and saves to localStorage', () => {
      const data = 'PayPal';

      const expectedActions = [{ type: types.CART_SAVE_PAYMENT_METHOD, payload: data }];

      store.dispatch(actions.savePaymentMethod(data));

      expect(store.getActions()).toEqual(expectedActions);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('paymentMethod', JSON.stringify(data));
    });
  });

  describe('saveGuestInfo', () => {
    it('creates CART_SAVE_GUEST_INFO and saves to localStorage', () => {
      const data = { email: 'test@test.com' };

      const expectedActions = [{ type: types.CART_SAVE_GUEST_INFO, payload: data }];

      store.dispatch(actions.saveGuestInfo(data));

      expect(store.getActions()).toEqual(expectedActions);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('guestInfo', JSON.stringify(data));
    });
  });
});
