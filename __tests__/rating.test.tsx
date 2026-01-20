import { render, screen } from '@testing-library/react';
import Rating from '@/components/Rating';
import React from 'react';

describe('Rating Component', () => {
  // 7. Render Full Stars
  it('renders full stars correctly', () => {
    const { container } = render(<Rating value={5} text="5 reviews" />);
    // value=5 => 5 full stars (fas fa-star)
    const fullStars = container.querySelectorAll('.fas.fa-star');
    expect(fullStars.length).toBe(5);
  });

  // 8. Render Half Stars
  it('renders half stars correctly', () => {
    const { container } = render(<Rating value={3.5} text="3.5 reviews" />);
    // value=3.5 => 3 full stars + 1 half star + 1 empty
    const fullStars = container.querySelectorAll('.fas.fa-star');
    expect(fullStars.length).toBe(3);

    const halfStars = container.querySelectorAll('.fas.fa-star-half-alt');
    expect(halfStars.length).toBe(1);
  });

  // 9. Render Empty Stars
  it('renders empty stars correctly', () => {
    const { container } = render(<Rating value={1} text="1 review" />);
    // value=1 => 1 full star + 4 empty stars
    const fullStars = container.querySelectorAll('.fas.fa-star');
    expect(fullStars.length).toBe(1);

    const emptyStars = container.querySelectorAll('.far.fa-star');
    expect(emptyStars.length).toBe(4);
  });

  // 10. Render Text
  it('renders text correctly', () => {
    render(<Rating value={4} text="10 reviews" />);
    expect(screen.getByText('10 reviews')).toBeInTheDocument();
  });

  // 11. Custom Color
  it('applies custom color', () => {
    const color = 'rgb(255, 0, 0)';
    const { container } = render(<Rating value={5} text="5 reviews" color={color} />);
    const firstStar = container.querySelector('i');
    expect(firstStar).toHaveStyle(`color: ${color}`);
  });

  it('renders correctly with 0 value and no text', () => {
    const { container } = render(<Rating value={0} />);
    const emptyStars = container.querySelectorAll('.far.fa-star');
    expect(emptyStars.length).toBe(5);
    expect(screen.queryByText('reviews')).not.toBeInTheDocument();
  });
});
