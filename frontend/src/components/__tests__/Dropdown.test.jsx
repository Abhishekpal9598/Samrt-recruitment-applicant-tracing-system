import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from '../common/Dropdown';

const SAMPLE_OPTIONS = [
  { label: 'Engineering', value: 'eng' },
  { label: 'Product & Design', value: 'des' },
  { label: 'Human Resources', value: 'hr' },
];

describe('Dropdown Component', () => {
  it('renders trigger button with placeholder or label', () => {
    render(<Dropdown label="Select Department" options={SAMPLE_OPTIONS} value="" placeholder="Pick one..." />);
    expect(screen.getByText('Select Department')).toBeInTheDocument();
    expect(screen.getByText('Pick one...')).toBeInTheDocument();
  });

  it('opens options list when clicked and selects an option', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Dropdown
        options={SAMPLE_OPTIONS}
        value=""
        onChange={handleChange}
        placeholder="Pick one..."
      />
    );

    const trigger = screen.getByRole('button', { name: /pick one/i });
    await user.click(trigger);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    const engOption = screen.getByRole('option', { name: /engineering/i });
    await user.click(engOption);

    expect(handleChange).toHaveBeenCalledWith('eng');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes dropdown when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<Dropdown options={SAMPLE_OPTIONS} value="" placeholder="Pick one..." />);

    const trigger = screen.getByRole('button', { name: /pick one/i });
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
