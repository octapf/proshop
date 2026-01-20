import React from 'react';
import { render, screen } from '@testing-library/react';
import CheckoutSteps from '@/components/CheckoutSteps';
import '@testing-library/jest-dom';

// Mock next/link to behave like a normal anchor for testing
jest.mock('next/link', () => {
  return ({ children, href, className }: any) => {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

describe('CheckoutSteps Component', () => {
  it('renders correctly with Step 1 active', () => {
    render(<CheckoutSteps step1 />);
    // Step 1: Sign In - should be a link
    const link1 = screen.getByRole('link', { name: /sign in/i });
    expect(link1).toHaveAttribute('href', '/login');
    expect(link1).toHaveClass('fw-bold text-success'); // Based on component logic
  });

  it('renders Step 2 enabled when step2 prop is passed', () => {
    render(<CheckoutSteps step1 step2 />);
    // Step 2: Shipping - should be a link
    const link2 = screen.getByRole('link', { name: /shipping/i });
    expect(link2).toHaveAttribute('href', '/shipping');
  });

  it('renders Step 2 disabled when step2 is false', () => {
    render(<CheckoutSteps step1 />); // step2 is undefined/false
    // When disabled, Nav.Link renders as a span or anchor without href usually, or with specific class
    // In React-Bootstrap Nav.Link disabled: renders <a> with `disabled` class and no href or valid link behavior
    // But queryByRole('link') might fail if no href.
    // Let's check the text.
    const step2Text = screen.getByText(/shipping/i);
    expect(step2Text).toBeInTheDocument();
    // It should not be a link or have disabled class
    expect(step2Text).toHaveClass('text-muted');
    // If it's a link, it should not have href, or if it does, check strictly
    // React-Bootstrap Nav.Link disabled usually renders <a class="nav-link disabled">
    // Let's verify if it has 'disabled' class if it's an element
    expect(step2Text).toHaveClass('nav-link');
    // It might not have href
    expect(step2Text).not.toHaveAttribute('href', '/shipping');
  });

  it('shows checkmark for completed steps', () => {
    render(<CheckoutSteps step1 step2 step3 step4 />);
    // If step3 is true (checking Shipping step logic: {step3 ? <i className="fas fa-check-circle me-1 text-success"></i> : ...})
    // Wait, in code:
    // Step 1: always checks prop step1.
    // Step 2 link: checks step2 prop. Inside content: checks step3 prop to show checkmark?
    // " {step3 ? <i ...></i> : <span...>2</span>} Shipping "
    // So if we are on step 4 (all true), step 2 should have checkmark.

    // Let's find logic in code:
    // <Nav.Item> ... href='/shipping' ... {step3 ? <i ...> : <span>2</span>} Shipping </Nav.Item>
    // So if step3 is passed, the Shipping link shows a checkmark icon.

    const link2 = screen.getByRole('link', { name: /shipping/i });
    // We expect the icon inside. Querying by class is tricky in RTL.
    // But we can check if "2" is NOT present.
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });
});
