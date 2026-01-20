import React from 'react';
import { render, screen } from '@testing-library/react';
import Message from '@/components/Message';
import '@testing-library/jest-dom';

describe('Message Component', () => {
  it('renders children correctly', () => {
    render(<Message>Test Message</Message>);
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('applies default varient (info)', () => {
    // react-bootstrap Alert adds class `alert-variant`
    const { container } = render(<Message>Default Variant</Message>);
    const alert = container.firstChild;
    expect(alert).toHaveClass('alert-info');
  });

  it('applies custom variant', () => {
    const { container } = render(<Message variant="danger">Error Message</Message>);
    const alert = container.firstChild;
    expect(alert).toHaveClass('alert-danger');
  });
});
