import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/[locale]/page';
import * as reactRedux from 'react-redux';
import * as navigation from 'next/navigation';
import { listProducts } from '@/redux/actions/productActions';

// Mock Redux
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

// Mock Actions
jest.mock('@/redux/actions/productActions', () => ({
  listProducts: jest.fn(),
}));

// Mock Navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));
import { useSearchParams } from 'next/navigation';

// Mock Translations
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock Components
jest.mock('@/components/Product', () => ({ product }: any) => (
  <div data-testid="product">{product.name}</div>
));
jest.mock('@/components/FilterSidebar', () => () => (
  <div data-testid="filter-sidebar">FilterSidebar</div>
));
jest.mock('@/components/ProductSkeleton', () => () => (
  <div data-testid="product-skeleton">Skeleton</div>
));
jest.mock('@/components/Message', () => ({ children }: any) => (
  <div data-testid="message">{children}</div>
));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => null,
    });
  });

  it('renders loading skeletons when loading is true', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      products: [],
    });

    render(<Home />);

    expect(screen.getAllByTestId('product-skeleton')).toHaveLength(8);
  });

  it('renders error message when error is present', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue({
      loading: false,
      error: 'Network Error',
      products: [],
    });

    render(<Home />);

    expect(screen.getByTestId('message')).toHaveTextContent('Network Error');
  });

  it('renders products when data is fetched', () => {
    const products = [
      { _id: '1', name: 'Product 1' },
      { _id: '2', name: 'Product 2' },
    ];
    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      products: products,
    });

    render(<Home />);

    expect(screen.getAllByTestId('product')).toHaveLength(2);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });

  it('renders no products message when list is empty', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      products: [],
    });

    render(<Home />);

    expect(screen.getByTestId('message')).toHaveTextContent(
      'No products found matching your criteria'
    );
  });

  it('dispatches listProducts with correct filters', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue({
      loading: false,
      products: [],
    });

    // Mock search params
    const mockGet = jest.fn((key) => {
      const params: any = {
        keyword: 'iphone',
        pageNumber: '2',
        category: 'Electronics',
        brand: 'Apple',
        minPrice: '100',
        maxPrice: '1000',
        rating: '4',
      };
      return params[key] || null;
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });

    render(<Home />);

    expect(listProducts).toHaveBeenCalledWith('iphone', '2', {
      category: 'Electronics',
      brand: 'Apple',
      minPrice: '100',
      maxPrice: '1000',
      rating: '4',
    });
  });

  it('dispatches listProducts with defaults', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue({
      loading: false,
      products: [],
    });

    // Mock search params Empty
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => null,
    });

    render(<Home />);

    expect(listProducts).toHaveBeenCalledWith('', '1', {
      category: null,
      brand: null,
      minPrice: null,
      maxPrice: null,
      rating: null,
    });
  });
});
