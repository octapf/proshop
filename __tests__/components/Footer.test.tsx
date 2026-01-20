import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Footer from '@/components/Footer';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mocks
jest.mock('axios');
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('Footer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<Footer />);
    // Check for some headings translated keys
    expect(screen.getByText('about')).toBeInTheDocument();
    expect(screen.getByText('contact')).toBeInTheDocument(); // Assuming these are keys or default text
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer tag has this role
  });

  it('handles newsletter subscription success', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });
    render(<Footer />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitBtn = screen.getByRole('button'); // Button has icon, might not have name accessible easily unless aria-label

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/newsletter', { email: 'test@example.com' });
      expect(screen.getByText('Thanks for subscribing!')).toBeInTheDocument();
    });
  });

  it('handles newsletter subscription failure', async () => {
    (axios.post as jest.Mock).mockRejectedValue({
      response: { data: { message: 'Invalid Email' } },
    });
    render(<Footer />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitBtn = screen.getByRole('button');

    fireEvent.change(emailInput, { target: { value: 'bad@email.com' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid Email')).toBeInTheDocument();
    });
  });
});
