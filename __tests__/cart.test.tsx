import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartScreen from '@/app/[locale]/cart/page';
import * as reactRedux from 'react-redux';
import { addToCart, removeFromCart } from '@/redux/actions/cartActions';

// Mock Redux
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

// Mock Actions
jest.mock('@/redux/actions/cartActions', () => ({
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
}));

// Mock Navigation
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();
const mockGet = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useSearchParams: () => ({ get: mockGet }),
  useRouter: () => ({ push: mockPush }),
}));

// Mock Image
jest.mock('react-bootstrap/Image', () => (props: any) => <img {...props} />);

// Mock Message
jest.mock('@/components/Message', () => ({ children }: any) => (
  <div data-testid="message">{children}</div>
));

import { useParams } from 'next/navigation';

describe('Cart Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({});
    mockGet.mockReturnValue(null);
  });

  const cartItems = [
    {
      product: '1',
      name: 'Product 1',
      image: '/img1.jpg',
      price: 100,
      countInStock: 5,
      qty: 1,
    },
    {
      product: '2',
      name: 'Product 2',
      image: '/img2.jpg',
      price: 200,
      countInStock: 3,
      qty: 2,
    },
  ];

  it('renders empty cart message', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ cart: { cartItems: [] } });
    });

    render(<CartScreen />);

    expect(screen.getByTestId('message')).toHaveTextContent('Your cart is empty');
  });

  it('renders cart items', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ cart: { cartItems } });
    });

    render(<CartScreen />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('$ 100.00')).toBeInTheDocument(); // Format .toFixed(2)
  });

  it('dispatches addToCart on load if productId is present', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    mockGet.mockReturnValue('3'); // qty

    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ cart: { cartItems: [] } });
    });

    render(<CartScreen />);

    expect(addToCart).toHaveBeenCalledWith('1', 3);
  });

  it('dispatches addToCart on qty change', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ cart: { cartItems } });
    });

    render(<CartScreen />);

    // Find select for Product 1 (value=1)
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: '2' } });

    expect(addToCart).toHaveBeenCalledWith('1', 2);
  });

  it('dispatches removeFromCart on delete click', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ cart: { cartItems } });
    });

    render(<CartScreen />);

    // Find delete button
    // The code logic for delete button:
    // <Button type='button' variant='light' onClick={() => removeFromCartHandler(item.product)}> <i className='fas fa-trash'></i> </Button>
    // It has no text. But we can search by class maybe? Or just all buttons.
    // The buttons in list are: Qty (select), Delete (button).
    // Actually the select is a select.
    // The only buttons are Delete buttons. And Checkout button.

    const deleteButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.innerHTML.includes('fa-trash'));
    fireEvent.click(deleteButtons[0]);

    expect(removeFromCart).toHaveBeenCalledWith('1');
  });

  it('navigates to login/shipping on checkout', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ cart: { cartItems } });
    });

    render(<CartScreen />);

    const checkoutBtn = screen.getByText('Proceed To Checkout');
    fireEvent.click(checkoutBtn);

    expect(mockPush).toHaveBeenCalledWith('/login?redirect=shipping');
  });

  it('calculates total price correctly', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ cart: { cartItems } });
    });

    render(<CartScreen />);

    // Total: 100*1 + 200*2 = 500
    // "Subtotal (3) items"
    // "$500.00"
    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });
});
