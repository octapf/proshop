import React from 'react';
import { render, screen } from '@testing-library/react';
import Paginate from '@/components/Paginate';
import '@testing-library/jest-dom';

jest.mock('next/link', () => {
  return ({ children, href, className }: any) => {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

describe('Paginate Component', () => {
  it('does not render if pages is 1', () => {
    render(<Paginate pages={1} page={1} />);
    const list = screen.queryByRole('list');
    expect(list).not.toBeInTheDocument();
  });

  it('renders pagination when pages > 1', () => {
    render(<Paginate pages={3} page={1} />);
    const list = screen.getByRole('list'); // Pagination renders a UL usually
    expect(list).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('highlight current page', () => {
    render(<Paginate pages={3} page={2} />);
    // The active class is usually on the li
    const items = screen.getAllByRole('listitem');
    // items[1] is page 2
    expect(items[1]).toHaveClass('active');
  });

  it('generates correct links for normal users', () => {
    render(<Paginate pages={2} page={1} />);
    const link2 = screen.getByRole('link', { name: '2' });
    expect(link2).toHaveAttribute('href', '/page/2');
  });

  it('generates correct links for admins', () => {
    render(<Paginate pages={2} page={1} isAdmin={true} />);
    const link2 = screen.getByRole('link', { name: '2' });
    expect(link2).toHaveAttribute('href', '/admin/productlist/?pageNumber=2');
  });

  it('generates correct links for search keyword', () => {
    render(<Paginate pages={2} page={1} keyword="iphone" />);
    const link2 = screen.getByRole('link', { name: '2' });
    expect(link2).toHaveAttribute('href', '/search/iphone/page/2');
  });
});
