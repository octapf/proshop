import { render, screen, fireEvent } from '@testing-library/react';
import { LoginContent } from '@/app/[locale]/login/page';
import React from 'react';
import * as reactRedux from 'react-redux';

// Mock Hooks
const mockPush = jest.fn();
const mockDispatch = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: () => null,
  }),
}));

jest.mock('@/redux/actions/userActions', () => ({
  login: (email: string, password: string) => ({
    type: 'USER_LOGIN_REQUEST',
    payload: { email, password },
  }),
}));

// Mock useSelector using jest.spyOn
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default Selector Implementation (Neutral/Initial State)
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        userLogin: { loading: false, error: null, userInfo: null },
      })
    );
  });

  it('renders login form correctly', async () => {
    render(<LoginContent />);

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();

    // Check for inputs by label text.
    // If Form.Control is used, this might fail if htmlFor isn't set perfectly in JSDOM.
    // We can fallback to placeholders or test ids if needed, but let's try standard accessibility first.
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows loader when login is in progress', async () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        userLogin: { loading: true, error: null, userInfo: null },
      })
    );

    render(<LoginContent />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message when login fails', async () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        userLogin: { loading: false, error: 'Invalid credentials', userInfo: null },
      })
    );

    render(<LoginContent />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('dispatches login action when form is submitted', async () => {
    render(<LoginContent />);

    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'USER_LOGIN_REQUEST',
      payload: { email: 'test@example.com', password: 'password123' },
    });
  });

  it('redirects if user is already logged in (userInfo present)', async () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        userLogin: { loading: false, error: null, userInfo: { name: 'Logged In User' } },
      })
    );

    render(<LoginContent />);

    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
