import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import JobRequisitionsPage from '../JobRequisitionsPage';
import { RecruitmentProvider } from '../../context/RecruitmentContext';

describe('JobRequisitionsPage Component', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  const renderPage = () => {
    return render(
      <RecruitmentProvider>
        <JobRequisitionsPage />
      </RecruitmentProvider>
    );
  };

  it('renders header, metrics cards, and requisition table', () => {
    renderPage();

    expect(screen.getByText('Job Requisition Management')).toBeInTheDocument();
    expect(screen.getByText('Total Requisitions')).toBeInTheDocument();
    expect(screen.getByText('Published & Active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Requisition/i })).toBeInTheDocument();
  });

  it('filters job requisitions by search keyword', () => {
    renderPage();

    const searchInput = screen.getByPlaceholderText(/Search by code, title, location.../i);
    fireEvent.change(searchInput, { target: { value: 'Staff Backend' } });

    expect(screen.getByText('Staff Backend Systems Architect')).toBeInTheDocument();
  });

  it('opens and cancels the Create Requisition modal', () => {
    renderPage();

    const createBtn = screen.getByRole('button', { name: /Create Requisition/i });
    fireEvent.click(createBtn);

    expect(screen.getByText('Create Job Requisition')).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByText('Create Job Requisition')).not.toBeInTheDocument();
  });
});
