import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  INITIAL_JOBS,
  INITIAL_CANDIDATES,
  INITIAL_DEPARTMENTS,
} from '../data/mockRecruitmentData';
import { ALLOWED_STAGE_TRANSITIONS } from '../pages/HRPipelinePage';

const RecruitmentContext = createContext(null);

const normalizeJob = (job) => {
  const reqCode = job.reqCode || job.code || 'REQ-0001';
  const type =
    job.type ||
    (job.employmentType === 'FULL_TIME'
      ? 'Full-time'
      : job.employmentType === 'CONTRACT'
      ? 'Contract'
      : job.employmentType || 'Full-time');
  const salary =
    job.salary ||
    (job.minSalary && job.maxSalary
      ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
      : 'Competitive');

  return {
    ...job,
    code: reqCode,
    reqCode,
    type,
    employmentType: job.employmentType || type,
    salary,
    location: job.location || 'Remote',
    title: job.title || '',
    status: job.status || 'DRAFT',
    createdAt: job.createdAt ? job.createdAt.slice(0, 10) : '2026-10-15',
  };
};

const normalizeCandidate = (cand) => {
  const role = cand.role || cand.application?.jobTitle || 'Role';
  const stage = cand.stage || cand.application?.stage || 'APPLIED';
  const department = cand.department || cand.application?.department || 'Engineering';
  const score =
    cand.score !== undefined
      ? cand.score
      : cand.application?.score
      ? parseInt(cand.application.score, 10) || 85
      : 85;
  const appliedDate =
    cand.appliedDate ||
    (cand.application?.submittedAt ? cand.application.submittedAt.slice(0, 10) : '2026-10-24');
  const recruiter = cand.recruiter || cand.application?.recruiter || 'Unassigned';
  const notes = cand.notes || cand.application?.notes || [];
  const history = cand.history || cand.application?.history || [];
  const resume = cand.resume || cand.application?.resume || null;
  const applicationId = cand.applicationId || cand.application?.id || cand.id;

  return {
    ...cand,
    role,
    stage,
    department,
    score,
    appliedDate,
    recruiter,
    notes,
    history,
    resume,
    applicationId,
    application: {
      id: applicationId,
      jobId: cand.application?.jobId || cand.jobId || 'job-1',
      jobTitle: role,
      department,
      stage,
      submittedAt: cand.application?.submittedAt || appliedDate,
      recruiter,
      score,
      history,
      notes,
      resume,
      ...(cand.application || {}),
    },
  };
};

export const RecruitmentProvider = ({ children }) => {
  // Load state with robust validation against malformed, null, or non-array session data
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = sessionStorage.getItem('smart_ats_jobs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeJob);
        }
      }
      return INITIAL_JOBS.map(normalizeJob);
    } catch {
      return INITIAL_JOBS.map(normalizeJob);
    }
  });

  const [candidates, setCandidates] = useState(() => {
    try {
      const saved = sessionStorage.getItem('smart_ats_candidates');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeCandidate);
        }
      }
      return INITIAL_CANDIDATES.map(normalizeCandidate);
    } catch {
      return INITIAL_CANDIDATES.map(normalizeCandidate);
    }
  });

  const [departments] = useState(INITIAL_DEPARTMENTS);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  // Sync to sessionStorage safely handling potential QuotaExceededError or disabled storage
  useEffect(() => {
    try {
      sessionStorage.setItem('smart_ats_jobs', JSON.stringify(jobs));
    } catch {
      // Gracefully continue in environments where sessionStorage is restricted
    }
  }, [jobs]);

  useEffect(() => {
    try {
      sessionStorage.setItem('smart_ats_candidates', JSON.stringify(candidates));
    } catch {
      // Gracefully continue in environments where sessionStorage is restricted
    }
  }, [candidates]);

  // Reset demo state back to pristine factory fixtures
  const resetToDemoDefaults = () => {
    try {
      sessionStorage.removeItem('smart_ats_jobs');
      sessionStorage.removeItem('smart_ats_candidates');
    } catch {
      // ignore
    }
    setJobs(INITIAL_JOBS.map(normalizeJob));
    setCandidates(INITIAL_CANDIDATES.map(normalizeCandidate));
    setSelectedCandidateId(null);
  };

  // A. Job Requisition Actions
  const createJob = (newJobData) => {
    const id = `job-${Date.now().toString().slice(-4)}`;
    const deptPrefix = (newJobData.department || 'ENG').substring(0, 3).toUpperCase();
    const reqCode = `${deptPrefix}-2026-${Math.floor(100 + Math.random() * 900)}`;

    const createdJob = normalizeJob({
      id,
      code: reqCode,
      reqCode,
      title: newJobData.title?.trim() || 'New Requisition',
      department: newJobData.department || 'Engineering',
      employmentType: newJobData.type || newJobData.employmentType || 'Full-time',
      type: newJobData.type || newJobData.employmentType || 'Full-time',
      experienceLevel: newJobData.experienceLevel || 'Mid-Level',
      location: newJobData.location?.trim() || 'Remote',
      minSalary: Number(newJobData.minSalary || newJobData.salaryMin) || null,
      maxSalary: Number(newJobData.maxSalary || newJobData.salaryMax) || null,
      currency: 'USD',
      status: newJobData.status || 'DRAFT',
      deadline: newJobData.deadline || null,
      description: newJobData.description?.trim() || '',
      requirements: newJobData.requirements?.trim() || '',
      benefits: newJobData.benefits?.trim() || 'Comprehensive healthcare, 401(k), flexible PTO.',
      skills: Array.isArray(newJobData.skills)
        ? newJobData.skills
        : newJobData.skills
        ? newJobData.skills.split(',').map((s) => s.trim())
        : [],
      applicantsCount: 0,
      createdAt: new Date().toISOString(),
      publishedAt: newJobData.status === 'PUBLISHED' ? new Date().toISOString() : null,
    });

    setJobs((prev) => [createdJob, ...prev]);
    return createdJob;
  };

  const updateJob = (id, updates) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id === id) {
          const isPublishing = updates.status === 'PUBLISHED' && job.status !== 'PUBLISHED';
          return normalizeJob({
            ...job,
            ...updates,
            publishedAt: isPublishing ? new Date().toISOString() : job.publishedAt,
            closedAt: updates.status === 'CLOSED' ? new Date().toISOString() : job.closedAt,
            updatedAt: new Date().toISOString(),
          });
        }
        return job;
      })
    );
  };

  const transitionJobStatus = (id, newStatus) => {
    updateJob(id, { status: newStatus });
  };

  // B. Candidate & Application Submission Actions
  const submitApplication = (payload) => {
    const {
      jobId,
      name,
      firstName,
      lastName,
      email,
      phone,
      linkedinUrl,
      portfolioUrl,
      resume,
      resumeFile,
    } = payload;

    const normalizedEmail = (email || '').trim().toLowerCase();

    // Duplicate Prevention: Verify candidate does not already have an active application for this exact job
    const existingActiveApplication = candidates.find((c) => {
      const matchEmail = (c.email || '').toLowerCase() === normalizedEmail;
      const targetJobId = c.jobId || c.application?.jobId;
      const matchJob = targetJobId === jobId;
      const isActive = !['REJECTED', 'WITHDRAWN'].includes(c.stage || c.application?.stage);
      return matchEmail && matchJob && isActive;
    });

    if (existingActiveApplication) {
      throw new Error(
        `An active application for this role has already been registered with email address ${normalizedEmail}. Multiple active submissions for the same opening are not permitted.`
      );
    }

    const targetJob = jobs.find((j) => j.id === jobId);
    // Collision-resistant unique Application Reference ID for demo scope
    const uniqueEntropy = `${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const appId = `APP-2026-${uniqueEntropy}`;
    const candId = `cand-${Date.now().toString().slice(-5)}-${Math.floor(10 + Math.random() * 90)}`;
    const nowIso = new Date().toISOString();
    const candidateName = name ? name.trim() : `${firstName?.trim() || ''} ${lastName?.trim() || ''}`.trim();
    
    // Privacy Safeguard: Store strictly non-sensitive file metadata (no base64 or blob content in storage)
    const actualResume = resume || (resumeFile ? {
      fileName: resumeFile.name,
      fileSize: resumeFile.size,
      fileType: resumeFile.type,
      uploadedAt: nowIso,
    } : null);

    const newCandidate = normalizeCandidate({
      id: candId,
      applicationId: appId,
      jobId,
      name: candidateName || 'New Applicant',
      email: normalizedEmail,
      phone: phone?.trim() || '',
      location: 'Applicant Provided',
      linkedinUrl: linkedinUrl?.trim() || null,
      portfolioUrl: portfolioUrl?.trim() || null,
      role: targetJob ? targetJob.title : payload.jobTitle || 'General Requisition',
      department: targetJob ? targetJob.department : payload.department || 'Engineering',
      stage: 'APPLIED',
      score: null,
      appliedDate: 'Just now',
      recruiter: 'Unassigned',
      skills: targetJob?.skills || ['Candidate Sourced'],
      resume: actualResume,
      history: [
        {
          stage: 'APPLIED',
          date: new Date().toLocaleString(),
          changedBy: 'Candidate Self-Service',
          notes: 'Application submitted through public careers portal.',
        },
      ],
      notes: [],
    });

    // Append to candidates list
    setCandidates((prev) => [newCandidate, ...prev]);

    // Increment applicants count on the job
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j))
    );

    return newCandidate;
  };

  const updateCandidateStage = (candidateId, newStage, transitionNotes = '') => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) {
      return {
        success: false,
        error: `Candidate ${candidateId} not found.`,
        message: `Candidate ${candidateId} not found.`,
        candidate: null,
      };
    }

    const currentStage = candidate.stage || 'APPLIED';
    const allowed = ALLOWED_STAGE_TRANSITIONS[currentStage] || [];

    // Strictly enforce state machine transitions; terminal states cannot transition
    if (!allowed.includes(newStage)) {
      return {
        success: false,
        error: `Invalid stage transition: cannot move from ${currentStage} to ${newStage}.`,
        message: `Invalid stage transition: cannot move from ${currentStage} to ${newStage}.`,
        candidate,
      };
    }

    const nowFormatted = new Date().toLocaleString();
    const newHistoryEntry = {
      stage: newStage,
      date: nowFormatted,
      changedBy: 'HR Recruiter (Current Session)',
      notes: transitionNotes || `Stage moved to ${newStage}.`,
    };

    const updated = normalizeCandidate({
      ...candidate,
      stage: newStage,
      history: [newHistoryEntry, ...(candidate.history || [])],
    });

    setCandidates((prev) => prev.map((c) => (c.id === candidateId ? updated : c)));

    return {
      success: true,
      error: null,
      message: `Successfully transitioned to ${newStage}.`,
      candidate: updated,
    };
  };

  const addCandidateNote = (candidateId, noteText, authorName = 'Recruiter') => {
    if (!noteText?.trim()) return;

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const newNote = {
            id: `note-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
            author: authorName,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            content: noteText.trim(),
          };

          return normalizeCandidate({
            ...c,
            notes: [...(c.notes || []), newNote],
          });
        }
        return c;
      })
    );
  };

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || null;

  return (
    <RecruitmentContext.Provider
      value={{
        jobs,
        candidates,
        departments,
        selectedCandidateId,
        selectedCandidate,
        setSelectedCandidateId,
        createJob,
        updateJob,
        updateJobStatus: transitionJobStatus,
        transitionJobStatus,
        submitApplication,
        updateCandidateStage,
        addCandidateNote,
        resetToDemoDefaults,
      }}
    >
      {children}
    </RecruitmentContext.Provider>
  );
};

RecruitmentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useRecruitment = () => {
  const context = useContext(RecruitmentContext);
  if (!context) {
    throw new Error('useRecruitment must be used within a RecruitmentProvider');
  }
  return context;
};

export default RecruitmentContext;
