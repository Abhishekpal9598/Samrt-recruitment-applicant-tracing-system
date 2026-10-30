import React, { useMemo } from 'react';
import PageContainer from '../components/common/PageContainer';
import Badge from '../components/common/Badge';
import {
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  ArrowRight,
  Briefcase,
  AlertCircle,
  XCircle,
  Award,
  Sparkles,
} from 'lucide-react';
import { useRecruitment } from '../context/RecruitmentContext';

export const CandidatePortalPage = () => {
  const { candidates } = useRecruitment();

  // Find user's applications (or fallback to latest candidate for demonstration)
  const candidateApplications = useMemo(() => {
    return candidates.slice(0, 3);
  }, [candidates]);

  const activeApplication = candidateApplications[0] || null;

  // Compute 5-step milestone pipeline strictly mapped against docs/APP_FLOW.md stages
  const getMilestones = (stage) => {
    const STAGE_ORDER = [
      { id: 'APPLIED', title: 'Application Submitted' },
      { id: 'SCREENING', title: 'Resume Screening' },
      { id: 'INTERVIEW', title: 'Technical Interview' },
      { id: 'OFFER', title: 'Offer Letter' },
      { id: 'ONBOARDING', title: 'Onboarding & Welcome' },
    ];

    let currentIdx = 0;
    let isTerminalRejected = false;
    let isTerminalWithdrawn = false;

    switch (stage) {
      case 'APPLIED':
        currentIdx = 0;
        break;
      case 'SCREENING':
        currentIdx = 1;
        break;
      case 'INTERVIEW_SCHEDULED':
      case 'INTERVIEW_COMPLETED':
        currentIdx = 2;
        break;
      case 'OFFERED':
        currentIdx = 3;
        break;
      case 'ACCEPTED':
      case 'ONBOARDING':
        currentIdx = 4;
        break;
      case 'HIRED':
        currentIdx = 5; // All 5 completed
        break;
      case 'REJECTED':
        isTerminalRejected = true;
        currentIdx = -1;
        break;
      case 'WITHDRAWN':
        isTerminalWithdrawn = true;
        currentIdx = -1;
        break;
      default:
        currentIdx = 0;
    }

    return STAGE_ORDER.map((item, idx) => {
      let status = 'pending';
      let statusText = 'Pending';

      if (isTerminalRejected) {
        status = 'rejected';
        statusText = 'Process Concluded';
      } else if (isTerminalWithdrawn) {
        status = 'withdrawn';
        statusText = 'Withdrawn by Candidate';
      } else if (currentIdx === 5 || idx < currentIdx) {
        status = 'completed';
        statusText = 'Completed';
      } else if (idx === currentIdx) {
        status = 'active';
        if (stage === 'INTERVIEW_COMPLETED') {
          statusText = 'Panel Evaluation in Progress';
        } else if (stage === 'ACCEPTED') {
          statusText = 'Offer Accepted - Pre-Onboarding';
        } else {
          statusText = 'In progress';
        }
      } else {
        status = 'pending';
        statusText = 'Awaiting prior steps';
      }

      return {
        ...item,
        status,
        statusText,
        stepNumber: idx + 1,
      };
    });
  };

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'APPLIED':
        return <Badge variant="neutral">Applied</Badge>;
      case 'SCREENING':
        return <Badge variant="primary">Screening</Badge>;
      case 'INTERVIEW_SCHEDULED':
        return <Badge variant="warning">Interview Scheduled</Badge>;
      case 'INTERVIEW_COMPLETED':
        return <Badge variant="primary">Interview Completed</Badge>;
      case 'OFFERED':
        return <Badge variant="success">Offer Extended</Badge>;
      case 'ACCEPTED':
        return <Badge variant="success">Offer Accepted</Badge>;
      case 'ONBOARDING':
        return <Badge variant="primary">Onboarding</Badge>;
      case 'HIRED':
        return <Badge variant="success">Hired</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      case 'WITHDRAWN':
        return <Badge variant="neutral">Withdrawn</Badge>;
      default:
        return <Badge variant="neutral">{stage}</Badge>;
    }
  };

  return (
    <PageContainer
      title="Candidate Portal"
      description="Track your real-time application milestones, scheduled interviews, and onboarding steps."
      breadcrumbs={[
        { label: 'Careers', href: '/jobs' },
        { label: 'Candidate Portal' },
      ]}
    >
      {!activeApplication ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No Active Applications Logged
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            You haven’t submitted any applications in this session yet. Explore our open positions to get started.
          </p>
          <div className="mt-6">
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <span>Explore Open Positions</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Application Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">
                    {activeApplication.applicationId || activeApplication.id}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {activeApplication.role}
                  </h2>
                  {getStageBadge(activeApplication.stage)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Applicant: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeApplication.name}</span>{' '}
                  • Department: {activeApplication.department || 'Engineering'} • Submitted on {activeApplication.appliedDate}
                </p>
              </div>

              {activeApplication.resume && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <FileText className="w-4 h-4 text-primary-600" />
                    <span className="truncate max-w-[150px] font-medium">{activeApplication.resume.fileName || activeApplication.resume.originalName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Milestone Tracker */}
            <div className="py-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
                Recruitment Milestone Progression
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {getMilestones(activeApplication.stage).map((step) => (
                  <div key={step.id} className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : step.status === 'active' ? (
                        <div className="w-5 h-5 rounded-full border-2 border-primary-600 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                        </div>
                      ) : step.status === 'rejected' ? (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      ) : step.status === 'withdrawn' ? (
                        <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                      )}
                      <span
                        className={`text-xs font-semibold ${
                          step.status === 'completed'
                            ? 'text-slate-900 dark:text-slate-200'
                            : step.status === 'active'
                            ? 'text-primary-600 dark:text-primary-400 font-bold'
                            : step.status === 'rejected'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        Step {step.stepNumber}
                      </span>
                    </div>
                    <div>
                      <p
                        className={`text-xs font-medium ${
                          step.status === 'active'
                            ? 'text-slate-900 dark:text-slate-100 font-bold'
                            : step.status === 'completed'
                            ? 'text-slate-700 dark:text-slate-300'
                            : 'text-slate-500 dark:text-slate-500'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {step.statusText}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contextual Action Callout based on Exact Documented Stage */}
            {activeApplication.stage === 'INTERVIEW_SCHEDULED' && (
              <div className="rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-primary-900 dark:text-primary-200">
                      Interview Scheduled with Hiring Panel
                    </h4>
                    <p className="text-xs text-primary-700 dark:text-primary-300 mt-0.5">
                      Your technical evaluation interview is confirmed. Please ensure your camera and microphone are configured prior to joining.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Calendar invitation token opened.')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors whitespace-nowrap"
                >
                  Add to Calendar
                </button>
              </div>
            )}

            {activeApplication.stage === 'INTERVIEW_COMPLETED' && (
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    Interview Completed — Scorecard Evaluation in Progress
                  </h4>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
                    Thank you for interviewing with our panel. Hiring managers are currently synthesizing evaluation scorecards. You will receive an update shortly.
                  </p>
                </div>
              </div>
            )}

            {activeApplication.stage === 'OFFERED' && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Offer Letter Extended!
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                      Congratulations! The hiring team has extended a formal employment offer. Review your offer package documents.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Offer review package downloaded.')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors whitespace-nowrap"
                >
                  Review Offer Package
                </button>
              </div>
            )}

            {activeApplication.stage === 'ACCEPTED' && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Offer Accepted — Preparing Onboarding Checklist
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Your digital acceptance has been logged. Our Talent Operations team is generating your pre-employment verification checklist.
                  </p>
                </div>
              </div>
            )}

            {activeApplication.stage === 'ONBOARDING' && (
              <div className="rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 p-4 flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-primary-900 dark:text-primary-200">
                    Onboarding Verification Underway
                  </h4>
                  <p className="text-xs text-primary-700 dark:text-primary-300 mt-0.5">
                    Please submit your verification documents (government ID, payroll setup) through the onboarding portal to finalize your employee provisioning.
                  </p>
                </div>
              </div>
            )}

            {activeApplication.stage === 'HIRED' && (
              <div className="rounded-xl bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 p-4 flex items-start gap-3">
                <Award className="w-5 h-5 text-emerald-700 dark:text-emerald-300 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                    Hired & Officially Provisioned!
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-200 mt-0.5">
                    Welcome to the team! Your employee onboarding has concluded successfully and your company credentials have been provisioned.
                  </p>
                </div>
              </div>
            )}

            {activeApplication.stage === 'REJECTED' && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-red-900 dark:text-red-200">
                    Application Status Update
                  </h4>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
                    Thank you for taking the time to speak with our team. We have decided to move forward with candidates whose experience more closely matches the current requirements for this specific role. We will keep your profile in our talent network for future openings.
                  </p>
                </div>
              </div>
            )}

            {activeApplication.stage === 'WITHDRAWN' && (
              <div className="rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 p-4 flex items-start gap-3">
                <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Application Withdrawn
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    This application has been closed per your request. You are welcome to browse open positions and apply to future roles whenever you wish.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Other Applications in History */}
          {candidateApplications.length > 1 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                Other Applications in your Record
              </h3>
              <div className="space-y-3">
                {candidateApplications.slice(1).map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          {app.role}
                        </span>
                        {getStageBadge(app.stage)}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {app.applicationId || app.id} • Applied {app.appliedDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default CandidatePortalPage;
