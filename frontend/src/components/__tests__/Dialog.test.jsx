import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dialog from '../common/Dialog';

describe('Dialog Component', () => {
  it('does not render when isOpen=false', () => {
    render(
      <Dialog isOpen={false} onClose={() => {}} title="Test Dialog">
        Content
      </Dialog>
    );
    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
  });

  it('renders modal dialog content when isOpen=true', () => {
    render(
      <Dialog
        isOpen={true}
        onClose={() => {}}
        title="Schedule Interview"
        description="Select date and interview panel"
      >
        <p>Candidate: Jane Doe</p>
      </Dialog>
    );
    expect(screen.getByText('Schedule Interview')).toBeInTheDocument();
    expect(screen.getByText('Select date and interview panel')).toBeInTheDocument();
    expect(screen.getByText('Candidate: Jane Doe')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Dialog isOpen={true} onClose={handleClose} title="Dialog">
        Modal body
      </Dialog>
    );

    await user.click(screen.getByRole('button', { name: /close dialog/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
