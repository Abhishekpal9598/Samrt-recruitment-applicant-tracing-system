import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import HRPipelinePage, { ALLOWED_STAGE_TRANSITIONS } from '../HRPipelinePage';

const renderPipeline = () => {
  return render(
    <BrowserRouter>
      <HRPipelinePage />
    </BrowserRouter>
  );
};

describe('HRPipelinePage Component', () => {
  it('renders Candidate Pipeline heading and candidate records', () => {
    renderPipeline();
    expect(screen.getByRole('heading', { name: /candidate pipeline/i })).toBeInTheDocument();
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    expect(screen.getByText('Sarah Lin')).toBeInTheDocument();
  });

  it('filters candidates based on search term', async () => {
    const user = userEvent.setup();
    renderPipeline();

    const searchInput = screen.getByPlaceholderText(/search candidate name, email, or role/i);
    await user.type(searchInput, 'Sarah Lin');

    expect(screen.getByText('Sarah Lin')).toBeInTheDocument();
    expect(screen.queryByText('Alex Rivera')).not.toBeInTheDocument();
  });

  it('enforces allowed stage transitions according to state machine', () => {
    renderPipeline();

    // Candidate Alex Rivera is in 'INTERVIEW_SCHEDULED'
    const select = screen.getByRole('combobox', { name: /advance stage for alex rivera/i });
    expect(select).toBeInTheDocument();

    const options = within(select)
      .getAllByRole('option')
      .map((opt) => opt.value)
      .filter(Boolean);

    // According to ALLOWED_STAGE_TRANSITIONS: ['INTERVIEW_COMPLETED', 'REJECTED', 'WITHDRAWN']
    expect(options).toEqual(ALLOWED_STAGE_TRANSITIONS.INTERVIEW_SCHEDULED);
    expect(options).not.toContain('HIRED');
    expect(options).not.toContain('APPLIED');
  });

  it('locks stage transitions for candidates in terminal states (e.g. REJECTED)', () => {
    renderPipeline();

    // Marcus Zhang is REJECTED (terminal state)
    expect(screen.getByText('Marcus Zhang')).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: /advance stage for marcus zhang/i })).not.toBeInTheDocument();
    expect(screen.getAllByText('Stage Locked').length).toBeGreaterThan(0);
  });

  it('successfully transitions candidate to next allowed stage with feedback notice', async () => {
    const user = userEvent.setup();
    renderPipeline();

    // Sarah Lin is in 'SCREENING'
    const select = screen.getByRole('combobox', { name: /advance stage for sarah lin/i });
    await user.selectOptions(select, 'INTERVIEW_SCHEDULED');

    // Should display feedback toast
    expect(await screen.findByRole('status')).toHaveTextContent(/updated sarah lin to interview scheduled/i);
  });
});
