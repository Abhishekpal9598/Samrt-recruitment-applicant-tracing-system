import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';
import { ThemeProvider } from '../../context/ThemeContext';

describe('Navigation Layout Components', () => {
  it('renders HR navigation items including Candidate Pipeline in Sidebar', () => {
    render(
      <BrowserRouter>
        <Sidebar role="HR" />
      </BrowserRouter>
    );

    expect(screen.getByText('Requisitions')).toBeInTheDocument();
    expect(screen.getByText('Candidate Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Interviews')).toBeInTheDocument();
    expect(screen.getByText('Offer Letters')).toBeInTheDocument();
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
  });

  it('renders Admin navigation items when role="ADMIN"', () => {
    render(
      <BrowserRouter>
        <Sidebar role="ADMIN" />
      </BrowserRouter>
    );

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Audit Trail Logs')).toBeInTheDocument();
    expect(screen.getByText('Global Settings')).toBeInTheDocument();
  });

  it('toggles collapse view state on desktop sidebar', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Sidebar role="HR" />
      </BrowserRouter>
    );

    const collapseBtn = screen.getByRole('button', { name: /collapse sidebar/i });
    expect(screen.getByText('Collapse view')).toBeInTheDocument();

    await user.click(collapseBtn);
    expect(screen.queryByText('Collapse view')).not.toBeInTheDocument();
  });

  it('renders mobile navigation drawer when isMobileOpen=true and handles close', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Sidebar role="HR" isMobileOpen={true} onCloseMobile={handleClose} />
      </BrowserRouter>
    );

    const closeBtn = screen.getByRole('button', { name: /close sidebar/i });
    expect(closeBtn).toBeInTheDocument();

    await user.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders Header with workspace title and theme toggle button', () => {
    render(
      <ThemeProvider>
        <BrowserRouter>
          <Header workspaceTitle="Talent Workspace" />
        </BrowserRouter>
      </ThemeProvider>
    );

    expect(screen.getByText('Talent Workspace')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle light and dark theme/i })).toBeInTheDocument();
  });
});
