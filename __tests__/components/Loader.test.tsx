import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '@/components/Loader';
import '@testing-library/jest-dom';

describe('Loader Component', () => {
  it('renders correctly', () => {
    render(<Loader />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('has correct default dimensions', () => {
    const { container } = render(<Loader />);
    const spinner = container.firstElementChild;
    expect(spinner).toHaveStyle({
      width: '100px',
      height: '100px',
    });
  });

  it('renders with custom size', () => {
    const { container } = render(<Loader width="50px" height="50px" />);
    const spinner = container.firstElementChild;
    expect(spinner).toHaveStyle({
      width: '50px',
      height: '50px',
    });
  });

  it('contains "Loading..." text for screen readers', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
