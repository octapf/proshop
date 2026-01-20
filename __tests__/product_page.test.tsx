import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductScreen from '@/app/[locale]/product/[id]/page';
import * as reactRedux from 'react-redux';
import { getProduct, listRelatedProducts } from '@/redux/actions/productActions';

// Mock Redux
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

// Mock Actions
jest.mock('@/redux/actions/productActions', () => ({
  getProduct: jest.fn(),
  listRelatedProducts: jest.fn(),
}));

// Mock Navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({ push: mockPush }),
}));

// Mock Components
jest.mock('@/components/Rating', () => () => <div data-testid="rating">Rating</div>);
jest.mock('@/components/Loader', () => () => <div data-testid="loader">Loading...</div>);
jest.mock('@/components/Message', () => ({ children }: any) => (
  <div data-testid="message">{children}</div>
));
jest.mock('@/components/ProductGallery', () => () => (
  <div data-testid="product-gallery">Gallery</div>
));
jest.mock('@/components/Product', () => ({ product }: any) => (
  <div data-testid="related-product">{product.name}</div>
));

describe('Product Details Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProduct = {
    _id: '1',
    name: 'Sample Product',
    image: '/images/sample.jpg',
    description: 'Sample Description',
    brand: 'Sample Brand',
    category: 'Sample Category',
    price: 99.99,
    countInStock: 5,
    rating: 4.5,
    numReviews: 12,
  };

  it('renders loading state initially', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      const state = {
        getProduct: { loading: true },
        productRelated: { loading: false, products: [] },
      };
      return callback(state);
    });

    render(<ProductScreen />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders product details when loaded', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      const state = {
        getProduct: { loading: false, product: mockProduct },
        productRelated: { loading: false, products: [] },
      };
      return callback(state);
    });

    render(<ProductScreen />);

    expect(screen.getByText('Sample Product')).toBeInTheDocument();
    expect(screen.getAllByText('$99.99')[0]).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByText('Add To Cart')).not.toBeDisabled();
  });

  it('shows out of stock message and disables button', () => {
    const outOfStockProduct = { ...mockProduct, countInStock: 0 };
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      const state = {
        getProduct: { loading: false, product: outOfStockProduct },
        productRelated: { loading: false, products: [] },
      };
      return callback(state);
    });

    render(<ProductScreen />);

    expect(screen.getByText('Out Of Stock')).toBeInTheDocument();
    expect(screen.getByText('Add To Cart')).toBeDisabled();
  });

  it('allows changing quantity', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      const state = {
        getProduct: { loading: false, product: mockProduct },
        productRelated: { loading: false, products: [] },
      };
      return callback(state);
    });

    render(<ProductScreen />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '3' } });

    expect(select).toHaveValue('3');
  });

  it('navigates to cart on Add To Cart click', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      const state = {
        getProduct: { loading: false, product: mockProduct },
        productRelated: { loading: false, products: [] },
      };
      return callback(state);
    });

    render(<ProductScreen />);

    const addToCartBtn = screen.getByText('Add To Cart');
    fireEvent.click(addToCartBtn);

    expect(mockPush).toHaveBeenCalledWith('/cart/1?qty=1');
  });

  it('renders related products', () => {
    const related = [{ _id: '2', name: 'Related Item' }];
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      const state = {
        getProduct: { loading: false, product: mockProduct },
        productRelated: { loading: false, products: related },
      };
      return callback(state);
    });

    render(<ProductScreen />);

    expect(screen.getByText('Related Item')).toBeInTheDocument();
  });

  it('dispatches getProduct and listRelatedProducts on load', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      const state = {
        getProduct: { loading: false, product: mockProduct },
        productRelated: { loading: false, products: [] },
      };
      return callback(state);
    });

    render(<ProductScreen />);

    expect(getProduct).toHaveBeenCalledWith('1');
    expect(listRelatedProducts).toHaveBeenCalledWith('1');
  });
});
