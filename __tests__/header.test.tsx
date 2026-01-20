import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';
import React from 'react';
import * as reactRedux from 'react-redux';

// Mock Dependencies
const mockDispatch = jest.fn();
const mockPush = jest.fn();
const mockToggleTheme = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

jest.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
  usePathname: () => '/',
  useRouter: () => ({ replace: jest.fn(), push: mockPush }),
}));

jest.mock('@/components/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: mockToggleTheme }),
}));

jest.mock('@/components/SearchBox', () => () => <div>SearchBox</div>);

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 16. Render Brand
  it('renders brand title correctly', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(() => {
      // We need to match the specific selector calls.
      // Ideally we mock the state shape completely.
      return {
        userInfo: null,
        cartItems: [],
        wishlistItems: [],
      };
    });

    // But Header uses separate selectors.
    // Let's rely on the mock returning the combined object or specific properties if selector logic extracts them.
    // Actually the code does:
    // const userLogin = useSelector(...) || {}; const {userInfo} = userLogin;
    // const cart = useSelector(...); const {cartItems} = cart;
    // const wishlist = ...

    // We can mock the implementation to handle different "state" objects if needed,
    // or just return a big merged object if the selectors are just identity or property access.
    // Looking at code: `state.userLogin`, `state.cart`.
    // So we can mock implementation to take the 'state' arg and return the sub-property.

    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        userLogin: { userInfo: null },
        cart: { cartItems: [] },
        wishlist: { wishlistItems: [] },
      });
    });

    render(<Header />);
    expect(screen.getByText('title')).toBeInTheDocument(); // Mocked translation 'title'
  });

  // 17. Render Login Link (Guest)
  it('renders login link when user is guest', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        userLogin: { userInfo: null },
        cart: { cartItems: [] },
        wishlist: { wishlistItems: [] },
      });
    });

    render(<Header />);
    expect(screen.getByText('login')).toBeInTheDocument();
  });

  // 18. Render User Menu (Logged In)
  it('renders user menu when user is logged in', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        userLogin: { userInfo: { name: 'John Doe', isAdmin: false } },
        cart: { cartItems: [] },
        wishlist: { wishlistItems: [] },
      });
    });

    render(<Header />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('login')).not.toBeInTheDocument();
  });

  // 19. Render Admin Menu
  it('renders admin menu when admin is logged in', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        userLogin: { userInfo: { name: 'Admin User', isAdmin: true } },
        cart: { cartItems: [] },
        wishlist: { wishlistItems: [] },
      });
    });

    render(<Header />);
    // We expect an Admin dropdown. In code it has title={t('admin')}
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  // 20. Cart Badge Count
  it('renders correct cart badge count', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        userLogin: { userInfo: null },
        cart: { cartItems: [{ qty: 2 }, { qty: 3 }] }, // Total 5
        wishlist: { wishlistItems: [] },
      });
    });

    render(<Header />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  // 21. Logout Handler
  it('dispatches logout action on logout click', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({
        userLogin: { userInfo: { name: 'John Doe' } },
        cart: { cartItems: [] },
        wishlist: { wishlistItems: [] },
      });
    });

    render(<Header />);

    // Open dropdown
    fireEvent.click(screen.getByText('John Doe'));
    // Click logout
    fireEvent.click(screen.getByText('logout'));

    expect(mockDispatch).toHaveBeenCalled();
  });
});
