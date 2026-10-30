import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../common/Badge';

describe('Badge Component', () => {
  it('renders stage text correctly', () => {
    render(<Badge stage="SCREENING" />);
    expect(screen.getByText('SCREENING')).toBeInTheDocument();
  });

  it('renders generic variant with custom text', () => {
    render(<Badge variant="success">Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders dot indicator when dot=true', () => {
    const { container } = render(<Badge variant="success" dot>Live</Badge>);
    const dot = container.querySelector('span.rounded-full');
    expect(dot).toBeInTheDocument();
  });

  it('applies correct styling for OFFERED stage', () => {
    const { container } = render(<Badge stage="OFFERED" />);
    const badge = container.querySelector('span');
    expect(badge.className).toContain('bg-amber-50');
  });
});
