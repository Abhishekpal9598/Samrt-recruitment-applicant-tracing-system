import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import JobApplicationModal from '../jobs/JobApplicationModal';
import { RecruitmentProvider } from '../../context/RecruitmentContext';

describe('JobApplicationModal Component', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  const mockJob = {
    id: 'job-1',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  };

  const renderModal = (props = {}) => {
    return render(
      <RecruitmentProvider>
        <JobApplicationModal
          isOpen={true}
          onClose={vi.fn()}
          job={mockJob}
          {...props}
        />
      </RecruitmentProvider>
    );
  };

  it('renders Step 1 with applicant contact fields and target position', () => {
    renderModal();

    expect(screen.getByText('Senior Full-Stack Engineer')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
  });

  it('validates required fields before allowing progression to Step 2', async () => {
    renderModal();

    const continueBtn = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueBtn);

    expect(await screen.findByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
    expect(screen.getByText('Email address is required')).toBeInTheDocument();
    expect(screen.getByText('Phone number is required')).toBeInTheDocument();
  });

  it('progresses to Step 2 when Step 1 is valid, and requires resume upload', async () => {
    renderModal();

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Rachel' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Green' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'rachel@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '+1 (555) 234-5678' },
    });

    const continueBtn = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueBtn);

    // Step 2 header should be visible
    expect(
      await screen.findByText('Upload Resume / Curriculum Vitae')
    ).toBeInTheDocument();

    // Trying to continue without resume should trigger validation
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(
      await screen.findByText('A resume in PDF or DOCX format is required (maximum 5MB)')
    ).toBeInTheDocument();
  });
});
