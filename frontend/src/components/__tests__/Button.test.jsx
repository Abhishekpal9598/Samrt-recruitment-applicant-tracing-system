import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../common/Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Submit Application</Button>);
    expect(screen.getByRole('button', { name: /submit application/i })).toBeInTheDocument();
  });

  it('renders loading spinner and disables button when isLoading=true', () => {
    render(<Button isLoading>Processing</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Processing')).toBeInTheDocument();
  });

  it('disables button when disabled=true', () => {
    render(<Button disabled>Disabled Action</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles click events properly', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click Me</Button>);

    await user.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies destructive variant styles', () => {
    render(<Button variant="destructive">Reject</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-danger-600');
  });
});
