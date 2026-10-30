import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import CandidateDirectoryPage from '../CandidateDirectoryPage';
import { RecruitmentProvider } from '../../context/RecruitmentContext';

describe('CandidateDirectoryPage Component', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  const renderPage = () => {
    return render(
      <RecruitmentProvider>
        <CandidateDirectoryPage />
      </RecruitmentProvider>
    );
  };

  it('renders title, metrics, and candidate directory table', () => {
    renderPage();

    expect(screen.getByText('Candidate Directory')).toBeInTheDocument();
    expect(screen.getByText('Total Applicants')).toBeInTheDocument();
    expect(screen.getByText('Active in Pipeline')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by name, role, email, skill.../i)).toBeInTheDocument();
  });

  it('filters candidates based on search query', () => {
    renderPage();

    const searchInput = screen.getByPlaceholderText(/Search by name, role, email, skill.../i);
    fireEvent.change(searchInput, { target: { value: 'Alex Rivera' } });

    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    expect(screen.queryByText('Marcus Chen')).not.toBeInTheDocument();
  });

  it('opens candidate profile drawer on View Profile click', () => {
    renderPage();

    const viewButtons = screen.getAllByRole('button', { name: /View Profile/i });
    fireEvent.click(viewButtons[0]);

    // Drawer should show candidate name in header and tabs
    expect(screen.getByRole('heading', { level: 2, name: /Alex Rivera/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Stage Timeline/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Internal Notes/i })).toBeInTheDocument();
  });
});
