import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../common/Input';

describe('Input Component', () => {
  it('renders label and input field', () => {
    render(<Input label="Email Address" placeholder="Enter email" />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
  });

  it('renders required asterisk when required=true', () => {
    render(<Input label="Full Name" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders error message and applies error styling', () => {
    render(<Input label="Password" error="Password is required" />);
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveTextContent('Password is required');
  });

  it('allows user typing', async () => {
    const user = userEvent.setup();
    render(<Input label="Job Title" placeholder="Type here" />);
    const input = screen.getByPlaceholderText(/type here/i);

    await user.type(input, 'Software Engineer');
    expect(input).toHaveValue('Software Engineer');
  });
});
