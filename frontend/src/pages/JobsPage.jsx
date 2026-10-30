import React, { useState, useMemo } from 'react';
import PageContainer from '../components/common/PageContainer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Dialog from '../components/common/Dialog';
import { Search, MapPin, Briefcase, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { useRecruitment } from '../context/RecruitmentContext';
import JobApplicationModal from '../components/jobs/JobApplicationModal';

export const JobsPage = () => {
  const { jobs, departments } = useRecruitment();

  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);

  // Show only PUBLISHED requisitions on public careers board
  const publishedJobs = useMemo(() => {
    return jobs.filter((job) => job.status === 'PUBLISHED');
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return publishedJobs.filter((job) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === '' ||
        job.title.toLowerCase().includes(q) ||
        (job.description && job.description.toLowerCase().includes(q)) ||
        (job.skills && job.skills.some((s) => s.toLowerCase().includes(q)));

      const matchesDept = department === 'ALL' || job.department === department;
      const matchesType = typeFilter === 'ALL' || job.type === typeFilter;

      return matchesSearch && matchesDept && matchesType;
    });
  }, [publishedJobs, searchTerm, department, typeFilter]);

  return (
    <PageContainer
      title="Open Positions"
      description="Discover career opportunities and join our high-performing team. Applications are processed through our centralized recruitment engine."
      breadcrumbs={[
        { label: 'Careers', href: '/' },
        { label: 'Job Openings' },
      ]}
    >
      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-8 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="sm:col-span-2">
          <Input
            id="job-search"
            placeholder="Search by role title, keyword, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div>
          <label htmlFor="dept-filter" className="sr-only">Filter by department</label>
          <select
            id="dept-filter"
            aria-label="Filter by department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="type-filter" className="sr-only">Filter by employment type</label>
          <select
            id="type-filter"
            aria-label="Filter by employment type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">All Employment Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Active Requisition Count */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Showing {filteredJobs.length} Published Opening{filteredJobs.length === 1 ? '' : 's'}
        </span>
        {(searchTerm || department !== 'ALL' || typeFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setDepartment('ALL');
              setTypeFilter('ALL');
            }}
            className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Job Card Grid */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No positions match your search criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords, clear active filters, or check back soon as new requisitions are published regularly.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-primary-400 dark:hover:border-primary-600 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-5 group"
            >
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-mono font-bold text-slate-400">{job.reqCode}</span>
                  <h2
                    className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    {job.title}
                  </h2>
                  <Badge variant="primary" size="sm">
                    {job.department}
                  </Badge>
                  {job.experienceLevel && (
                    <Badge variant="neutral" size="sm">
                      {job.experienceLevel}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.type}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" /> {job.salary}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> Posted {job.posted || job.createdAt}
                  </span>
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedJob(job)}
                >
                  View Role
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  iconPosition="right"
                  onClick={() => setApplyingJob(job)}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Role Details Modal */}
      <Dialog
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        title={selectedJob?.title}
        description={`${selectedJob?.department} • ${selectedJob?.location} • ${selectedJob?.salary || 'Competitive'}`}
        footer={
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" onClick={() => setSelectedJob(null)}>
              Close
            </Button>
            <Button
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => {
                const targetJob = selectedJob;
                setSelectedJob(null);
                setApplyingJob(targetJob);
              }}
            >
              Apply for this Position
            </Button>
          </div>
        }
      >
        {selectedJob && (
          <div className="space-y-5 text-sm text-slate-700 dark:text-slate-300">
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Role Overview
              </h4>
              <p className="leading-relaxed text-xs sm:text-sm">{selectedJob.description}</p>
            </div>

            {selectedJob.requirements && (
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Core Requirements & Responsibilities
                </h4>
                <p className="leading-relaxed text-xs sm:text-sm whitespace-pre-line">
                  {selectedJob.requirements}
                </p>
              </div>
            )}

            {selectedJob.skills && selectedJob.skills.length > 0 && (
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Key Competencies & Technical Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Employment Type:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedJob.type}</p>
              </div>
              <div>
                <span className="text-slate-400">Location Policy:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedJob.location}</p>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Multi-step Application Modal */}
      <JobApplicationModal
        isOpen={Boolean(applyingJob)}
        onClose={() => setApplyingJob(null)}
        job={applyingJob}
      />
    </PageContainer>
  );
};

export default JobsPage;
