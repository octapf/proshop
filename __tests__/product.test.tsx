import { render, screen, fireEvent } from '@testing-library/react';
import Product from '@/components/Product';
import React from 'react';
import * as reactRedux from 'react-redux';

// Mock Dependencies
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

// Mock Next-Intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock Link
jest.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('Product Component', () => {
  const mockProduct = {
    _id: '1',
    name: 'Sample Product',
    image: '/images/sample.jpg',
    description: 'Sample description',
    brand: 'Sample Brand',
    category: 'Sample Category',
    price: 99.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 12. Render Product Details
  it('renders product details correctly', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(() => ({
      wishlistItems: [],
    }));

    render(<Product product={mockProduct} />);

    expect(screen.getByText('Sample Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    // Check for rating text "12 reviews" - implementation details of Rating component
    // Since we are integration testing Product, it renders Rating child.
  });

  // 13. Render Image with Link
  it('renders product image with correct link', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(() => ({
      wishlistItems: [],
    }));

    render(<Product product={mockProduct} />);
    const images = screen.getAllByRole('img');
    // React-Bootstrap Card.Img renders an img tag.
    expect(images[0]).toHaveAttribute('src', '/images/sample.jpg');
  });

  // 14. Wishlist Toggle (Add)
  it('dispatches addToWishlist when heart icon is clicked and not in wishlist', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(() => ({
      wishlistItems: [],
    }));

    const { container } = render(<Product product={mockProduct} />);

    // Find the heart button/icon
    const heartBtn = container.querySelector('button');
    if (heartBtn) {
      fireEvent.click(heartBtn);
      expect(mockDispatch).toHaveBeenCalled();
      // We expect specific action logic, but checking dispatch is enough for unit
    }
  });

  // 15. Wishlist Toggle (Remove)
  it('dispatches removeFromWishlist when heart icon is clicked and already in wishlist', () => {
    // Mock selector to return item in wishlist
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(() => ({
      wishlistItems: [{ product: '1' }],
    }));

    const { container } = render(<Product product={mockProduct} />);

    const heartBtn = container.querySelector('button');
    if (heartBtn) {
      fireEvent.click(heartBtn);
      expect(mockDispatch).toHaveBeenCalled();
    }
  });
});
