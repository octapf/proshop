import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderScreen from '@/app/[locale]/order/[id]/page';
import * as reactRedux from 'react-redux';
import { getOrderDetails, payOrder, deliverOrder } from '@/redux/actions/orderActions';
import axios from 'axios';

// Mock Redux
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

// Mock Actions
jest.mock('@/redux/actions/orderActions', () => ({
  getOrderDetails: jest.fn(),
  payOrder: jest.fn(),
  deliverOrder: jest.fn(),
}));

// Mock Axios
jest.mock('axios');

// Mock Navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'order123' }),
  useRouter: () => ({ push: mockPush }),
}));

// Mock PayPal
jest.mock('@paypal/react-paypal-js', () => ({
  PayPalScriptProvider: ({ children }: any) => <div>{children}</div>,
  PayPalButtons: ({ onApprove }: any) => (
    <button
      onClick={() =>
        onApprove({}, { order: { capture: jest.fn().mockResolvedValue({ status: 'COMPLETED' }) } })
      }
    >
      PayPal Mock
    </button>
  ),
}));

// Mock Image
jest.mock('react-bootstrap/Image', () => (props: any) => <img {...props} />);

// Mock Message/Loader
jest.mock('@/components/Message', () => ({ children }: any) => (
  <div data-testid="message">{children}</div>
));
jest.mock('@/components/Loader', () => () => <div data-testid="loader">Loading...</div>);

describe('Order Details Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (axios.get as jest.Mock).mockResolvedValue({ data: 'client-id' });
  });

  const mockOrder = {
    _id: 'order123',
    user: { name: 'John Doe', email: 'john@example.com' },
    orderItems: [{ name: 'Product 1', qty: 1, price: 10, image: '/img1.jpg', product: '1' }],
    shippingAddress: {
      address: '123 St',
      city: 'City',
      postalCode: '123',
      country: 'CA',
    },
    paymentMethod: 'PayPal',
    itemsPrice: 10,
    shippingPrice: 100,
    taxPrice: 1.5,
    totalPrice: 111.5,
    isPaid: false,
    isDelivered: false,
  };

  it('renders loading initially', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        orderDetails: { loading: true },
        userLogin: { userInfo: { name: 'User' } },
        orderPay: {},
        orderDeliver: {},
      });
    });

    render(<OrderScreen />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('redirects to login if not logged in', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        orderDetails: { loading: true, order: null }, // loading true prevents render crash
        userLogin: { userInfo: null }, // No user
        orderPay: {},
        orderDeliver: {},
      });
    });

    render(<OrderScreen />);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('renders order details when loaded', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        orderDetails: { loading: false, order: mockOrder },
        userLogin: { userInfo: { name: 'User' } },
        orderPay: {},
        orderDeliver: {},
      });
    });

    render(<OrderScreen />);

    expect(screen.getByText('Order order123')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('123 St, City, 123, CA')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Not Paid')).toBeInTheDocument();
    expect(screen.getByText('Not Delivered')).toBeInTheDocument();
  });

  it('renders PayPal buttons when unpaid', async () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        orderDetails: { loading: false, order: mockOrder },
        userLogin: { userInfo: { name: 'User' } },
        orderPay: { loading: false },
        orderDeliver: {},
      });
    });

    // We need to wait for useEffect that fetches client id
    render(<OrderScreen />);

    await waitFor(() => expect(screen.getByText('PayPal Mock')).toBeInTheDocument());
  });

  it('dispatches payOrder on successful payment', async () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        orderDetails: { loading: false, order: mockOrder },
        userLogin: { userInfo: { name: 'User' } },
        orderPay: { loading: false },
        orderDeliver: {},
      });
    });

    render(<OrderScreen />);

    const payBtn = await screen.findByText('PayPal Mock');
    fireEvent.click(payBtn);

    await waitFor(() => expect(payOrder).toHaveBeenCalled());
  });

  it('shows Mark As Delivered button for admin', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        orderDetails: { loading: false, order: { ...mockOrder, isPaid: true } },
        userLogin: { userInfo: { name: 'Admin', isAdmin: true } },
        orderPay: {},
        orderDeliver: {},
      });
    });

    render(<OrderScreen />);

    expect(screen.getByText('Mark As Delivered')).toBeInTheDocument();
  });

  it('dispatches deliverOrder on admin click', () => {
    const paidOrder = { ...mockOrder, isPaid: true };
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        orderDetails: { loading: false, order: paidOrder },
        userLogin: { userInfo: { name: 'Admin', isAdmin: true } },
        orderPay: {},
        orderDeliver: {},
      });
    });

    render(<OrderScreen />);

    const deliverBtn = screen.getByText('Mark As Delivered');
    fireEvent.click(deliverBtn);

    expect(deliverOrder).toHaveBeenCalledWith(paidOrder);
  });
});
