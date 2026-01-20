import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentScreen from '@/app/[locale]/payment/page';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useRouter } from 'next/navigation';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/redux/actions/cartActions', () => ({
  savePaymentMethod: jest.fn((data) => ({ type: 'SAVE_PAYMENT_METHOD', payload: data })),
}));

jest.mock('next/link', () => ({ children, href }: any) => <a href={href}>{children}</a>);

const mockStore = configureStore([]);

describe('PaymentScreen', () => {
  let store: any;
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    store = mockStore({
      userLogin: { userInfo: { name: 'User' } },
      cart: {
        shippingAddress: { address: 'Exists' },
        guestInfo: null,
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders payment options', () => {
    render(
      <Provider store={store}>
        <PaymentScreen />
      </Provider>
    );
    expect(screen.getByLabelText(/PayPal/i)).toBeInTheDocument();
    // Use getByLabelText or getByRole for radio. Note: React-Bootstrap Check/Radio structure might vary
    // Usually <Form.Check type='radio' label='PayPal' id='PayPal' ... />
    // Label points to input.
    expect(screen.getByLabelText(/PayPal/i)).toBeChecked();
  });

  it('redirects to shipping if no address', () => {
    store = mockStore({
      userLogin: { userInfo: { name: 'User' } },
      cart: {
        shippingAddress: {}, // Empty
        guestInfo: null,
      },
    });
    render(
      <Provider store={store}>
        <PaymentScreen />
      </Provider>
    );
    expect(pushMock).toHaveBeenCalledWith('/shipping');
  });

  it('submits payment method', () => {
    render(
      <Provider store={store}>
        <PaymentScreen />
      </Provider>
    );

    // Default is PayPal
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'SAVE_PAYMENT_METHOD',
      payload: 'PayPal',
    });
    expect(pushMock).toHaveBeenCalledWith('/placeorder');
  });
});
