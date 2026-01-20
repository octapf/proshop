import React from 'react';
import { render, screen } from '@testing-library/react';
import FormContainer from '@/components/FormContainer';
import '@testing-library/jest-dom';

describe('FormContainer Component', () => {
  it('renders children', () => {
    render(
      <FormContainer>
        <div data-testid="child">Child Content</div>
      </FormContainer>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
