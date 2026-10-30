import { useState } from 'react';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Dropdown from '../components/common/Dropdown';
import Dialog from '../components/common/Dialog';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '../components/common/Table';
import { Plus, Search, Filter, CheckCircle2 } from 'lucide-react';

// Strict State Machine Transitions conforming to docs/APP_FLOW.md
export const ALLOWED_STAGE_TRANSITIONS = {
  APPLIED: ['SCREENING', 'REJECTED', 'WITHDRAWN'],
  SCREENING: ['INTERVIEW_SCHEDULED', 'REJECTED', 'WITHDRAWN'],
  INTERVIEW_SCHEDULED: ['INTERVIEW_COMPLETED', 'REJECTED', 'WITHDRAWN'],
  INTERVIEW_COMPLETED: ['OFFERED', 'INTERVIEW_SCHEDULED', 'REJECTED'],
  OFFERED: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: ['ONBOARDING'],
  ONBOARDING: ['HIRED', 'REJECTED'],
  HIRED: [],
  REJECTED: [],
  WITHDRAWN: [],
};

export const STAGE_DISPLAY_NAMES = {
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEW_SCHEDULED: 'Interview Scheduled',
  INTERVIEW_COMPLETED: 'Interview Completed',
  OFFERED: 'Offer Extended',
  ACCEPTED: 'Offer Accepted',
  ONBOARDING: 'Onboarding',
  HIRED: 'Hired',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

const INITIAL_CANDIDATES = [
  {
    id: 'app-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'Senior Full-Stack Engineer',
    stage: 'INTERVIEW_SCHEDULED',
    score: '4.5 ★',
    appliedDate: 'Oct 24, 2026',
    recruiter: 'Marcus Vance',
  },
  {
    id: 'app-2',
    name: 'Sarah Lin',
    email: 'sarah.lin@example.com',
    role: 'Staff Backend Architect',
    stage: 'SCREENING',
    score: 'Pending',
    appliedDate: 'Oct 26, 2026',
    recruiter: 'Marcus Vance',
  },
  {
    id: 'app-3',
    name: 'David O’Connor',
    email: 'david.oc@example.com',
    role: 'Senior Full-Stack Engineer',
    stage: 'OFFERED',
    score: '4.8 ★',
    appliedDate: 'Oct 18, 2026',
    recruiter: 'Sarah Jenkins',
  },
  {
    id: 'app-4',
    name: 'Emily Watson',
    email: 'emily.w@example.com',
    role: 'Lead Product Designer',
    stage: 'ONBOARDING',
    score: '4.9 ★',
    appliedDate: 'Oct 12, 2026',
    recruiter: 'Marcus Vance',
  },
  {
    id: 'app-5',
    name: 'Marcus Zhang',
    email: 'marcus.z@example.com',
    role: 'Senior Full-Stack Engineer',
    stage: 'REJECTED',
    score: '2.5 ★',
    appliedDate: 'Oct 20, 2026',
    recruiter: 'Marcus Vance',
  },
];

export const HRPipelinePage = () => {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [stageFilter, setStageFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || c.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const handleStageChange = (candidateId, newStage) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    const allowed = ALLOWED_STAGE_TRANSITIONS[candidate.stage] || [];
    if (!allowed.includes(newStage)) {
      setFeedbackNotice({
        type: 'error',
        message: `Invalid transition: Cannot move from ${candidate.stage} to ${newStage}.`,
      });
      return;
    }

    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );

    setFeedbackNotice({
      type: 'success',
      message: `Updated ${candidate.name} to ${STAGE_DISPLAY_NAMES[newStage]}.`,
    });

    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  return (
    <PageContainer
      title="Candidate Pipeline"
      subtitle="Track, screen, and coordinate candidates across all active requisitions."
      breadcrumbs={[
        { label: 'Talent Workspace', href: '/hr/pipeline' },
        { label: 'Candidate Pipeline' },
      ]}
      actions={
        <>
          <Button variant="secondary" size="sm" leftIcon={Filter}>
            Filter View
          </Button>
          <Button
            size="sm"
            leftIcon={Plus}
            onClick={() => setIsModalOpen(true)}
          >
            Create Job Requisition
          </Button>
        </>
      }
    >
      {/* Toast / Notification Banner */}
      {feedbackNotice && (
        <div
          role="status"
          className={`mb-4 px-4 py-2.5 rounded-md border text-xs font-medium flex items-center gap-2 transition-all ${
            feedbackNotice.type === 'error'
              ? 'bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-950/40 dark:text-danger-300 dark:border-danger-800'
              : 'bg-success-50 text-success-700 border-success-200 dark:bg-success-950/40 dark:text-success-300 dark:border-success-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{feedbackNotice.message}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-subtle">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search candidate name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={Search}
          />
        </div>
        <div className="w-full sm:w-60">
          <Dropdown
            options={[
              { label: 'All Stages', value: 'ALL' },
              { label: 'Screening', value: 'SCREENING' },
              { label: 'Interview Scheduled', value: 'INTERVIEW_SCHEDULED' },
              { label: 'Offered', value: 'OFFERED' },
              { label: 'Onboarding', value: 'ONBOARDING' },
              { label: 'Rejected', value: 'REJECTED' },
            ]}
            value={stageFilter}
            onChange={(val) => setStageFilter(val)}
          />
        </div>
      </div>

      {/* Enterprise Candidates Table with Responsive Layout */}
      <Table className="min-w-[640px]">
        <TableHeader>
          <tr>
            <TableHead>Candidate</TableHead>
            <TableHead>Applied Position</TableHead>
            <TableHead>Current Stage</TableHead>
            <TableHead className="hidden sm:table-cell">Score</TableHead>
            <TableHead className="hidden md:table-cell">Applied Date</TableHead>
            <TableHead className="hidden lg:table-cell">Recruiter</TableHead>
            <TableHead className="text-right">Stage Transition</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredCandidates.map((c) => {
            const nextAllowed = ALLOWED_STAGE_TRANSITIONS[c.stage] || [];
            const isTerminal = nextAllowed.length === 0;

            return (
              <TableRow key={c.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white leading-tight">
                      {c.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                      {c.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium">{c.role}</TableCell>
                <TableCell>
                  <Badge stage={c.stage} />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {c.score}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs text-neutral-500">
                  {c.appliedDate}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-neutral-600 dark:text-neutral-400">
                  {c.recruiter}
                </TableCell>
                <TableCell className="text-right">
                  {isTerminal ? (
                    <span className="text-[11px] text-neutral-400 dark:text-neutral-500 italic font-medium px-2 py-1">
                      Stage Locked
                    </span>
                  ) : (
                    <select
                      aria-label={`Advance stage for ${c.name}`}
                      value=""
                      onChange={(e) => handleStageChange(c.id, e.target.value)}
                      className="text-xs py-1 px-2.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-subtle focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                    >
                      <option value="" disabled>
                        Move to...
                      </option>
                      {nextAllowed.map((stg) => (
                        <option key={stg} value={stg}>
                          {STAGE_DISPLAY_NAMES[stg] || stg}
                        </option>
                      ))}
                    </select>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Modal Dialog for New Requisition */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Job Requisition"
        description="Configure new hiring opening, headcount approval, and department mapping."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                alert(`Requisition "${newJobTitle || 'Untitled'}" created as Draft!`);
                setIsModalOpen(false);
                setNewJobTitle('');
              }}
            >
              Save Draft Requisition
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Position Title"
            required
            placeholder="e.g., Senior Full-Stack Engineer"
            value={newJobTitle}
            onChange={(e) => setNewJobTitle(e.target.value)}
          />
          <Dropdown
            label="Department"
            options={[
              { label: 'Engineering', value: 'eng' },
              { label: 'Product & Design', value: 'des' },
              { label: 'Human Resources', value: 'hr' },
              { label: 'Marketing', value: 'mkt' },
            ]}
            value="eng"
            onChange={() => {}}
          />
          <Input
            label="Location"
            placeholder="e.g., Remote / Hybrid - New York"
            defaultValue="Remote"
          />
        </div>
      </Dialog>
    </PageContainer>
  );
};

export default HRPipelinePage;
