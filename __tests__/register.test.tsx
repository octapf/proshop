import { render, screen, fireEvent } from '@testing-library/react';
import { RegisterContent } from '@/app/[locale]/register/page';
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
  register: (name: string, email: string, password: string) => ({
    type: 'USER_REGISTER_REQUEST',
    payload: { name, email, password },
  }),
}));

// Mock useSelector using jest.spyOn (but via factory since jest.mock hoists)
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default Selector Implementation (Neutral/Initial State)
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        userRegister: { loading: false, error: null, userInfo: null },
        userLogin: { userInfo: null },
      })
    );
  });

  it('renders registration form correctly', async () => {
    render(<RegisterContent />);

    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows loader when registration is in progress', async () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        userRegister: { loading: true, error: null, userInfo: null },
        userLogin: { userInfo: null },
      })
    );

    render(<RegisterContent />);
    // Check for spinner/loader
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message when registration fails', async () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        userRegister: { loading: false, error: 'User already exists', userInfo: null },
        userLogin: { userInfo: null },
      })
    );

    render(<RegisterContent />);
    expect(screen.getByText('User already exists')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('validates password mismatch on client side', async () => {
    render(<RegisterContent />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: '999999' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('dispatches register action when form is valid', async () => {
    render(<RegisterContent />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'USER_REGISTER_REQUEST',
      payload: { name: 'Test User', email: 'test@example.com', password: '123456' },
    });
  });

  it('redirects if user is already logged in (userLogin state)', async () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        userRegister: { loading: false, error: null, userInfo: null },
        userLogin: { userInfo: { name: 'Existing User' } },
      })
    );

    render(<RegisterContent />);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('redirects if registration is successful (userInfo in userRegister state)', async () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        userRegister: { loading: false, error: null, userInfo: { name: 'New User' } },
        userLogin: { userInfo: null },
      })
    );

    render(<RegisterContent />);

    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
