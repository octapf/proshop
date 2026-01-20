import { cartReducer } from '@/redux/reducers/cartReducers';
import * as actions from '@/redux/constants/cartConstants';

describe('cartReducer', () => {
  // 1. Initial State
  it('should return the initial state', () => {
    const initialState = {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: '',
      guestInfo: {},
    };
    // @ts-ignore
    expect(cartReducer(undefined, {})).toEqual(initialState);
  });

  // 2. Add New Item
  it('should handle CART_ADD_ITEM for a new item', () => {
    const initialState: any = { cartItems: [] };
    const newItem = { product: '1', name: 'Product 1', price: 10, qty: 1 };

    const action = { type: actions.CART_ADD_ITEM, payload: newItem };
    const state = cartReducer(initialState, action);

    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0]).toEqual(newItem);
  });

  // 3. Update Existing Item
  it('should handle CART_ADD_ITEM for an existing item (update qty)', () => {
    const existingItem = { product: '1', name: 'Product 1', price: 10, qty: 1 };
    const initialState: any = { cartItems: [existingItem] };

    const updatedItem = { product: '1', name: 'Product 1', price: 10, qty: 2 };
    const action = { type: actions.CART_ADD_ITEM, payload: updatedItem };
    const state = cartReducer(initialState, action);

    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0].qty).toBe(2);
  });

  // 4. Remove Item
  it('should handle CART_REMOVE_ITEM', () => {
    const item1 = { product: '1', name: 'Product 1', price: 10, qty: 1 };
    const item2 = { product: '2', name: 'Product 2', price: 20, qty: 1 };
    const initialState: any = { cartItems: [item1, item2] };

    const action = { type: actions.CART_REMOVE_ITEM, payload: '1' };
    const state = cartReducer(initialState, action);

    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0]).toEqual(item2);
  });

  // 5. Save Shipping Address
  it('should handle CART_SAVE_SHIPPING_ADDRESS', () => {
    const initialState: any = { shippingAddress: {} };
    const address = { address: '123 St', city: 'City', postalCode: '12345', country: 'Country' };

    const action = { type: actions.CART_SAVE_SHIPPING_ADDRESS, payload: address };
    const state = cartReducer(initialState, action);

    expect(state.shippingAddress).toEqual(address);
  });

  // 6. Reset Cart
  it('should handle CART_RESET', () => {
    const initialState: any = {
      cartItems: [{ product: '1' }],
      shippingAddress: { address: '123' },
      paymentMethod: 'PayPal',
    };
    const action = { type: actions.CART_RESET };
    const state = cartReducer(initialState, action);

    expect(state.cartItems).toEqual([]);
    expect(state.shippingAddress).toEqual({});
    expect(state.paymentMethod).toBe('');
  });
});
