import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileScreen from '@/app/[locale]/profile/page';
import * as reactRedux from 'react-redux';
import { getUserDetails, updateUserProfile } from '@/redux/actions/userActions';
import { listMyOrders } from '@/redux/actions/orderActions';

// Mock Redux
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

// Mock Actions
jest.mock('@/redux/actions/userActions', () => ({
  getUserDetails: jest.fn(),
  updateUserProfile: jest.fn(),
}));
jest.mock('@/redux/actions/orderActions', () => ({
  listMyOrders: jest.fn(),
}));

// Mock Navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock Components
jest.mock('@/components/Message', () => ({ children, variant }: any) => (
  <div data-testid="message" className={variant}>
    {children}
  </div>
));
jest.mock('@/components/Loader', () => () => <div data-testid="loader">Loading...</div>);

describe('Profile Screen', () => {
  const mockUser = { name: 'John Doe', email: 'john@example.com' };
  const mockOrders = [
    {
      _id: '1',
      totalPrice: 100,
      isPaid: true,
      paidAt: '2023-01-01',
      isDelivered: false,
      createdAt: '2023-01-01',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login if not logged in', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        userLogin: { userInfo: null },
        userDetails: { user: null },
        userUpdateProfile: {},
        orderListMy: { orders: [] },
      });
    });

    render(<ProfileScreen />);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('renders user details and orders', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        userLogin: { userInfo: mockUser },
        userDetails: { user: mockUser, loading: false },
        userUpdateProfile: {},
        orderListMy: { orders: mockOrders, loading: false },
      });
    });

    render(<ProfileScreen />);

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('100'))).toBeInTheDocument(); // Price in table
    // ID 1 might be a link
    expect(screen.getAllByRole('link', { name: /details/i })).toHaveLength(1);
  });

  it('dispatches updateUserProfile on submit', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        userLogin: { userInfo: mockUser },
        userDetails: { user: mockUser },
        userUpdateProfile: {},
        orderListMy: { orders: [] },
      });
    });

    render(<ProfileScreen />);

    // Change name
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/^Password$/), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: '123' } });

    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    expect(updateUserProfile).toHaveBeenCalledWith({
      id: undefined, // user._id not in mockUser above, keeping undefined or fix mockUser
      name: 'Jane Doe',
      email: 'john@example.com',
      password: '123',
    });
  });

  it('shows password mismatch error', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        userLogin: { userInfo: mockUser },
        userDetails: { user: mockUser },
        userUpdateProfile: {},
        orderListMy: { orders: [] },
      });
    });

    render(<ProfileScreen />);

    fireEvent.change(screen.getByLabelText(/^Password$/), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: '124' } });

    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    expect(screen.getByTestId('message')).toHaveTextContent('Passwords do not match');
    expect(updateUserProfile).not.toHaveBeenCalled();
  });
});
