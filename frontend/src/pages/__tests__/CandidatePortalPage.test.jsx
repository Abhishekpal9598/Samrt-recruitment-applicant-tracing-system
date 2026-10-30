import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CandidatePortalPage from '../CandidatePortalPage';
import { RecruitmentProvider } from '../../context/RecruitmentContext';

describe('CandidatePortalPage Component', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  const renderPortal = () => {
    return render(
      <MemoryRouter>
        <RecruitmentProvider>
          <CandidatePortalPage />
        </RecruitmentProvider>
      </MemoryRouter>
    );
  };

  it('renders candidate portal heading and milestone pipeline', () => {
    renderPortal();

    expect(screen.getByRole('heading', { level: 1, name: 'Candidate Portal' })).toBeInTheDocument();
    expect(screen.getByText(/Recruitment Milestone Progression/i)).toBeInTheDocument();
    expect(screen.getByText('Application Submitted')).toBeInTheDocument();
    expect(screen.getByText('Resume Screening')).toBeInTheDocument();
    expect(screen.getByText('Technical Interview')).toBeInTheDocument();
    expect(screen.getByText('Offer Letter')).toBeInTheDocument();
    expect(screen.getByText('Onboarding & Welcome')).toBeInTheDocument();
  });

  it('renders accurate contextual callout for candidate in interview scheduled stage', () => {
    renderPortal();

    // Default top candidate is in INTERVIEW_SCHEDULED stage
    expect(
      screen.getByText(/Interview Scheduled with Hiring Panel/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add to Calendar/i })).toBeInTheDocument();
  });
});
