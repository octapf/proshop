import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlaceOrderScreen from '@/app/[locale]/placeorder/page';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useRouter } from 'next/navigation';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/redux/actions/orderActions', () => ({
  createOrder: jest.fn((order) => ({ type: 'ORDER_CREATE_REQUEST', payload: order })),
}));

jest.mock('next/link', () => ({ children, href }: any) => <a href={href}>{children}</a>);

jest.mock('next/image', () => ({ src, alt }: any) => <img src={src} alt={alt} />);

// Mock components that might cause issues?
// CheckoutSteps is fine. Message is fine.

const mockStore = configureStore([]);

describe('PlaceOrderScreen', () => {
  let store: any;
  let pushMock: jest.Mock;

  const initialState = {
    userLogin: { userInfo: { name: 'User' } },
    cart: {
      shippingAddress: { address: '123 St', city: 'City', postalCode: '123', country: 'CA' },
      paymentMethod: 'PayPal',
      cartItems: [
        { product: '1', name: 'Product 1', price: 10, qty: 1, image: '/img1.jpg' },
        { product: '2', name: 'Product 2', price: 20, qty: 2, image: '/img2.jpg' },
      ],
    },
    orderCreate: { success: false, order: null, error: null },
  };

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  it('renders order summary correctly', () => {
    render(
      <Provider store={store}>
        <PlaceOrderScreen />
      </Provider>
    );

    expect(screen.getByRole('heading', { name: 'Shipping' })).toBeInTheDocument();
    // Use regex to handle trailing spaces or case
    expect(screen.getByText(/Address:/)).toBeInTheDocument();
    expect(screen.getByText('123 St, City, 123, CA')).toBeInTheDocument();
    expect(screen.getByText(/Method:/)).toBeInTheDocument();
    expect(screen.getByText('PayPal')).toBeInTheDocument();

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    // Calculations:
    // Item Price: 10*1 + 20*2 = 50.00
    // Shipping: 50 < 100 -> 100.00 (Wait, logic: Number(cart.itemsPrice) > 100 ? 0 : 100) -> 50 !> 100 so 100.
    // Tax: 50 * 0.15 = 7.50
    // Total: 50 + 100 + 7.50 = 157.50

    expect(screen.getByText('$50.00')).toBeInTheDocument(); // Items
    expect(screen.getByText('$100.00')).toBeInTheDocument(); // Shipping
    expect(screen.getByText('$7.50')).toBeInTheDocument(); // Tax
    expect(screen.getByText('$157.50')).toBeInTheDocument(); // Total
  });

  it('redirects if no shipping address', () => {
    store = mockStore({
      ...initialState,
      cart: { ...initialState.cart, shippingAddress: {} },
    });
    render(
      <Provider store={store}>
        <PlaceOrderScreen />
      </Provider>
    );
    expect(pushMock).toHaveBeenCalledWith('/shipping');
  });

  it('redirects if no payment method', () => {
    store = mockStore({
      ...initialState,
      cart: { ...initialState.cart, paymentMethod: null },
    });
    render(
      <Provider store={store}>
        <PlaceOrderScreen />
      </Provider>
    );
    expect(pushMock).toHaveBeenCalledWith('/payment');
  });

  it('dispatches createOrder on button click', () => {
    render(
      <Provider store={store}>
        <PlaceOrderScreen />
      </Provider>
    );
    const placeBtn = screen.getByRole('button', { name: /Place Order/i });
    fireEvent.click(placeBtn);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ORDER_CREATE_REQUEST',
      })
    );
  });

  it('redirects to order page on success', () => {
    store = mockStore({
      ...initialState,
      orderCreate: { success: true, order: { _id: 'order123' } },
    });
    render(
      <Provider store={store}>
        <PlaceOrderScreen />
      </Provider>
    );
    expect(pushMock).toHaveBeenCalledWith('/order/order123');
  });
});
