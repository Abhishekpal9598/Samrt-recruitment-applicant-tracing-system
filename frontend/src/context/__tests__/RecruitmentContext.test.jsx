import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { RecruitmentProvider, useRecruitment } from '../RecruitmentContext';

describe('RecruitmentContext', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  const wrapper = ({ children }) => <RecruitmentProvider>{children}</RecruitmentProvider>;

  it('initializes with default jobs, candidates, and departments', () => {
    const { result } = renderHook(() => useRecruitment(), { wrapper });

    expect(result.current.jobs.length).toBeGreaterThan(0);
    expect(result.current.candidates.length).toBeGreaterThan(0);
    expect(result.current.departments.length).toBeGreaterThan(0);
  });

  it('creates a new job requisition with code and DRAFT status', () => {
    const { result } = renderHook(() => useRecruitment(), { wrapper });

    let createdJob;
    act(() => {
      createdJob = result.current.createJob({
        title: 'Principal Security Architect',
        department: 'Engineering',
        type: 'Full-time',
        location: 'Remote',
        experienceLevel: 'Executive',
        salaryMin: 180000,
        salaryMax: 220000,
        description: 'Lead enterprise security architecture and auditing.',
        requirements: 'CISSP, 10+ years security engineering.',
      });
    });

    expect(createdJob).toBeDefined();
    expect(createdJob.title).toBe('Principal Security Architect');
    expect(createdJob.reqCode).toMatch(/^(REQ|ENG|DES|HR|MKT|OPS)-\d+/);
    expect(createdJob.status).toBe('DRAFT');
    expect(result.current.jobs).toContainEqual(expect.objectContaining({ id: createdJob.id }));
  });

  it('updates an existing job requisition', () => {
    const { result } = renderHook(() => useRecruitment(), { wrapper });
    const targetJob = result.current.jobs[0];

    act(() => {
      result.current.updateJob(targetJob.id, {
        title: 'Updated Role Title',
        department: targetJob.department,
        type: targetJob.type,
        location: targetJob.location,
      });
    });

    const updated = result.current.jobs.find((j) => j.id === targetJob.id);
    expect(updated.title).toBe('Updated Role Title');
  });

  it('transitions job lifecycle states', () => {
    const { result } = renderHook(() => useRecruitment(), { wrapper });
    const targetJob = result.current.jobs[0];

    act(() => {
      result.current.updateJobStatus(targetJob.id, 'PUBLISHED');
    });

    const published = result.current.jobs.find((j) => j.id === targetJob.id);
    expect(published.status).toBe('PUBLISHED');
  });

  it('submits a new candidate application and updates candidate roster', () => {
    const { result } = renderHook(() => useRecruitment(), { wrapper });
    const initialCandidateCount = result.current.candidates.length;

    let newCandidate;
    act(() => {
      newCandidate = result.current.submitApplication({
        jobId: 'job-1',
        jobTitle: 'Senior Full-Stack Engineer',
        department: 'Engineering',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1-555-0199',
        resume: {
          fileName: 'jane_resume.pdf',
          fileSize: 102400,
          fileType: 'application/pdf',
        },
      });
    });

    expect(newCandidate).toBeDefined();
    expect(newCandidate.name).toBe('Jane Doe');
    expect(newCandidate.stage).toBe('APPLIED');
    expect(newCandidate.applicationId).toMatch(/^APP-\d{4}-/);
    expect(result.current.candidates.length).toBe(initialCandidateCount + 1);
  });

  it('prevents duplicate active submissions for the same job with the same email', () => {
    const { result } = renderHook(() => useRecruitment(), { wrapper });

    act(() => {
      result.current.submitApplication({
        jobId: 'job-1',
        name: 'Single Applicant',
        email: 'single@example.com',
        phone: '+1-555-0123',
      });
    });

    // Submitting again with the same email for job-1 must throw a duplicate prevention error
    expect(() => {
      act(() => {
        result.current.submitApplication({
          jobId: 'job-1',
          name: 'Single Applicant Dup',
          email: 'single@example.com',
          phone: '+1-555-0123',
        });
      });
    }).toThrow(/already been registered/i);
  });

  it('enforces allowed stage machine transitions and rejects invalid transitions', () => {
    const { result } = renderHook(() => useRecruitment(), { wrapper });
    let candidate = result.current.candidates.find((c) => c.stage === 'APPLIED');
    if (!candidate) {
      act(() => {
        candidate = result.current.submitApplication({
          jobId: 'job-1',
          name: 'Stage Test Candidate',
          email: 'stage.test@example.com',
          phone: '+1-555-0199',
        });
      });
    }

    expect(candidate).toBeDefined();

    // Valid transition: APPLIED -> SCREENING
    let validTransitionResult;
    act(() => {
      validTransitionResult = result.current.updateCandidateStage(
        candidate.id,
        'SCREENING',
        'Passed initial resume check'
      );
    });
    expect(validTransitionResult.success).toBe(true);
    expect(validTransitionResult.candidate.stage).toBe('SCREENING');

    // Invalid transition: SCREENING -> HIRED (skipping interview and offer)
    let invalidTransitionResult;
    act(() => {
      invalidTransitionResult = result.current.updateCandidateStage(
        candidate.id,
        'HIRED',
        'Direct jump attempt'
      );
    });
    expect(invalidTransitionResult.success).toBe(false);
    expect(invalidTransitionResult.error).toContain('Invalid stage transition');
  });

  it('prevents any stage transition from terminal states like HIRED or REJECTED', () => {
    const { result } = renderHook(() => useRecruitment(), { wrapper });
    const rejectedCandidate = result.current.candidates.find((c) => c.stage === 'REJECTED');
    expect(rejectedCandidate).toBeDefined();

    let attemptResult;
    act(() => {
      attemptResult = result.current.updateCandidateStage(
        rejectedCandidate.id,
        'APPLIED',
        'Attempt to resurrect rejected candidate'
      );
    });

    expect(attemptResult.success).toBe(false);
    expect(attemptResult.error).toContain('cannot move from REJECTED to APPLIED');
  });

  it('recovers gracefully from malformed or non-array session storage data', () => {
    window.sessionStorage.setItem('smart_ats_jobs', '{"invalid":"object"}');
    window.sessionStorage.setItem('smart_ats_candidates', 'malformed-json');

    const { result } = renderHook(() => useRecruitment(), { wrapper });

    expect(Array.isArray(result.current.jobs)).toBe(true);
    expect(result.current.jobs.length).toBeGreaterThan(0);
    expect(Array.isArray(result.current.candidates)).toBe(true);
    expect(result.current.candidates.length).toBeGreaterThan(0);
  });

  it('adds recruiter notes with timestamp and author', () => {
    const { result } = renderHook(() => useRecruitment(), { wrapper });
    const candidate = result.current.candidates[0];

    act(() => {
      result.current.addCandidateNote(
        candidate.id,
        'Strong system design performance during screen.',
        'Sarah Jenkins'
      );
    });

    const updated = result.current.candidates.find((c) => c.id === candidate.id);
    expect(updated.notes.length).toBeGreaterThan(0);
    expect(updated.notes[updated.notes.length - 1].content).toBe(
      'Strong system design performance during screen.'
    );
    expect(updated.notes[updated.notes.length - 1].author).toBe('Sarah Jenkins');
  });

  it('resets state to default fixtures and clears custom session storage', () => {
    const { result } = renderHook(() => useRecruitment(), { wrapper });

    act(() => {
      result.current.createJob({
        title: 'Temporary Test Role',
        department: 'Operations',
      });
    });

    expect(result.current.jobs.some((j) => j.title === 'Temporary Test Role')).toBe(true);

    act(() => {
      result.current.resetToDemoDefaults();
    });

    expect(result.current.jobs.some((j) => j.title === 'Temporary Test Role')).toBe(false);
  });
});
