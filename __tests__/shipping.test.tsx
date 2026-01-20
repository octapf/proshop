import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShippingScreen from '@/app/[locale]/shipping/page';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useRouter } from 'next/navigation';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/redux/actions/cartActions', () => ({
  saveShippingAddress: jest.fn((data) => ({ type: 'SAVE_SHIPPING_ADDRESS', payload: data })),
}));

// Mock Link used in CheckoutSteps
jest.mock('next/link', () => ({ children, href }: any) => <a href={href}>{children}</a>);

const mockStore = configureStore([]);

describe('ShippingScreen', () => {
  let store: any;
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    store = mockStore({
      userLogin: { userInfo: { name: 'User' } },
      cart: {
        shippingAddress: {},
        guestInfo: null,
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders shipping form', () => {
    render(
      <Provider store={store}>
        <ShippingScreen />
      </Provider>
    );
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postal Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
  });

  it('pre-fills form from state', () => {
    store = mockStore({
      userLogin: { userInfo: { name: 'User' } },
      cart: {
        shippingAddress: {
          address: '123 St',
          city: 'City',
          postalCode: '12345',
          country: 'Country',
        },
        guestInfo: null,
      },
    });
    render(
      <Provider store={store}>
        <ShippingScreen />
      </Provider>
    );
    expect(screen.getByLabelText(/Address/i)).toHaveValue('123 St');
  });

  it('submits form and redirects', () => {
    render(
      <Provider store={store}>
        <ShippingScreen />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: 'New St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'New City' } });
    fireEvent.change(screen.getByLabelText(/Postal Code/i), { target: { value: '00000' } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: 'New Country' } });

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        address: 'New St',
        city: 'New City',
        postalCode: '00000',
        country: 'New Country',
      },
    });
    expect(pushMock).toHaveBeenCalledWith('/payment');
  });

  it('redirects to login if not logged in', () => {
    store = mockStore({
      userLogin: { userInfo: null },
      cart: { shippingAddress: {}, guestInfo: null },
    });
    render(
      <Provider store={store}>
        <ShippingScreen />
      </Provider>
    );
    expect(pushMock).toHaveBeenCalledWith('/login');
  });
});
