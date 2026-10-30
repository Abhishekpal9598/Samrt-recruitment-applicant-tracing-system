import React, { useState, useMemo } from 'react';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '../components/common/Table';
import {
  Search,
  Users,
  Eye,
  Calendar,
  Sparkles,
  UserCheck,
  FileText,
} from 'lucide-react';
import { useRecruitment } from '../context/RecruitmentContext';
import CandidateProfileDrawer from '../components/candidates/CandidateProfileDrawer';

export default function CandidateDirectoryPage() {
  const { candidates, departments, updateCandidateStage, addCandidateNote } = useRecruitment();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  // Selected Candidate
  const selectedCandidate = useMemo(() => {
    return candidates.find((c) => c.id === selectedCandidateId) || null;
  }, [candidates, selectedCandidateId]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = candidates.length;
    const activePipeline = candidates.filter(
      (c) => !['HIRED', 'REJECTED', 'WITHDRAWN'].includes(c.stage)
    ).length;
    const interviews = candidates.filter((c) =>
      ['INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED'].includes(c.stage)
    ).length;
    const hired = candidates.filter((c) => c.stage === 'HIRED').length;

    return { total, activePipeline, interviews, hired };
  }, [candidates]);

  // Filter Candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const q = (searchQuery || '').toLowerCase().trim();
      const name = (candidate.name || '').toLowerCase();
      const email = (candidate.email || '').toLowerCase();
      const role = (candidate.role || candidate.application?.jobTitle || '').toLowerCase();

      const matchesSearch =
        q === '' ||
        name.includes(q) ||
        email.includes(q) ||
        role.includes(q) ||
        (candidate.skills && candidate.skills.some((s) => s.toLowerCase().includes(q)));

      const matchesStage = stageFilter === 'ALL' || candidate.stage === stageFilter;
      const matchesDept = departmentFilter === 'ALL' || candidate.department === departmentFilter;

      return matchesSearch && matchesStage && matchesDept;
    });
  }, [candidates, searchQuery, stageFilter, departmentFilter]);

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
      title="Candidate Directory"
      description="Holistic talent roster, application timelines, evaluated fit scores, and recruiter collaboration."
    >
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Applicants
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{metrics.total}</p>
          </div>
          <div className="p-3 bg-primary-50 dark:bg-primary-950/40 rounded-xl text-primary-600 dark:text-primary-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              Active in Pipeline
            </p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
              {metrics.activePipeline}
            </p>
          </div>
          <div className="p-3 bg-primary-50 dark:bg-primary-950/40 rounded-xl text-primary-600 dark:text-primary-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Interviews Scheduled
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{metrics.interviews}</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-600 dark:text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Hired Candidates
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{metrics.hired}</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-80">
            <Input
              id="search-candidates"
              placeholder="Search by name, role, email, skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Stage filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Stage:</span>
              <select
                aria-label="Filter by Stage"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="ALL">All Stages</option>
                <option value="APPLIED">Applied</option>
                <option value="SCREENING">Screening</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="INTERVIEW_COMPLETED">Interview Completed</option>
                <option value="OFFERED">Offer Extended</option>
                <option value="ACCEPTED">Offer Accepted</option>
                <option value="ONBOARDING">Onboarding</option>
                <option value="HIRED">Hired</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>

            {/* Department filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Dept:</span>
              <select
                aria-label="Filter by Department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {(searchQuery || stageFilter !== 'ALL' || departmentFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStageFilter('ALL');
                  setDepartmentFilter('ALL');
                }}
                className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Candidate Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Target Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Pipeline Stage</TableHead>
              <TableHead>Match Score</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Recruiter</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <Users className="w-10 h-10 text-slate-400 mb-3" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No matching candidates found
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Try clearing filters or search terms to inspect the talent roster.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCandidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer"
                  onClick={() => setSelectedCandidateId(candidate.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{candidate.name}</span>
                          {candidate.resume && (
                            <FileText className="w-3 h-3 text-slate-400" title="Resume attached" />
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{candidate.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                      {candidate.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                    {candidate.department}
                  </TableCell>
                  <TableCell>{getStageBadge(candidate.stage)}</TableCell>
                  <TableCell>
                    {candidate.score ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              candidate.score >= 90
                                ? 'bg-emerald-500'
                                : candidate.score >= 75
                                ? 'bg-primary-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${candidate.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {candidate.score}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Pending review</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                    {candidate.appliedDate}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                    {candidate.recruiter || 'Unassigned'}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setSelectedCandidateId(candidate.id)}
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Candidate Profile Slide-Over Drawer */}
      <CandidateProfileDrawer
        candidate={selectedCandidate}
        isOpen={Boolean(selectedCandidateId)}
        onClose={() => setSelectedCandidateId(null)}
        onStageChange={updateCandidateStage}
        onAddNote={addCandidateNote}
      />
    </PageContainer>
  );
}
