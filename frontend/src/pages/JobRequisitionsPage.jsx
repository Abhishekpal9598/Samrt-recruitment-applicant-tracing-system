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
  Plus,
  Search,
  Briefcase,
  Edit2,
  CheckCircle,
  Archive,
  Eye,
  Users,
  MapPin,
  Clock,
} from 'lucide-react';
import { useRecruitment } from '../context/RecruitmentContext';
import RequisitionFormModal from '../components/jobs/RequisitionFormModal';

export default function JobRequisitionsPage() {
  const { jobs, departments, createJob, updateJob, updateJobStatus, candidates } = useRecruitment();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

  const showToast = (message) => {
    setToastNotification({ message });
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Requisition Metrics calculation
  const metrics = useMemo(() => {
    return {
      total: jobs.length,
      published: jobs.filter((j) => j.status === 'PUBLISHED').length,
      draft: jobs.filter((j) => j.status === 'DRAFT').length,
      closed: jobs.filter((j) => j.status === 'CLOSED' || j.status === 'ARCHIVED').length,
    };
  }, [jobs]);

  // Map candidates count to jobs
  const applicantsByJob = useMemo(() => {
    const map = {};
    candidates.forEach((c) => {
      const jId = c.jobId || c.application?.jobId;
      if (jId) {
        map[jId] = (map[jId] || 0) + 1;
      }
    });
    return map;
  }, [candidates]);

  // Filtering
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = (searchQuery || '').toLowerCase().trim();
      const title = (job.title || '').toLowerCase();
      const code = (job.reqCode || job.code || '').toLowerCase();
      const loc = (job.location || '').toLowerCase();

      const matchesSearch =
        q === '' ||
        title.includes(q) ||
        code.includes(q) ||
        loc.includes(q);

      const matchesDept = departmentFilter === 'ALL' || job.department === departmentFilter;
      const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
      const matchesType = employmentTypeFilter === 'ALL' || job.type === employmentTypeFilter;

      return matchesSearch && matchesDept && matchesStatus && matchesType;
    });
  }, [jobs, searchQuery, departmentFilter, statusFilter, employmentTypeFilter]);

  const handleCreateOpen = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleEditOpen = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleSaveRequisition = (formData) => {
    if (editingJob) {
      updateJob(editingJob.id, formData);
      showToast(`Requisition ${editingJob.reqCode || editingJob.code} successfully updated.`);
    } else {
      const created = createJob(formData);
      showToast(`Requisition ${created.reqCode} successfully created in ${created.status} state.`);
    }
  };

  const handleStatusChange = (jobId, reqCode, newStatus) => {
    updateJobStatus(jobId, newStatus);
    showToast(`Requisition ${reqCode} transitioned to ${newStatus}.`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge variant="success">Published</Badge>;
      case 'DRAFT':
        return <Badge variant="neutral">Draft</Badge>;
      case 'CLOSED':
        return <Badge variant="warning">Closed</Badge>;
      case 'ARCHIVED':
        return <Badge variant="danger">Archived</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <PageContainer
      title="Job Requisition Management"
      description="Create, review, publish, and govern job openings across departments."
      actions={
        <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />} onClick={handleCreateOpen}>
          Create Requisition
        </Button>
      }
    >
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 flex items-center gap-3 animate-fade-in text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastNotification.message}</span>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Requisitions
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{metrics.total}</p>
          </div>
          <div className="p-3 bg-primary-50 dark:bg-primary-950/40 rounded-xl text-primary-600 dark:text-primary-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Published & Active
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{metrics.published}</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Internal Drafts
            </p>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mt-1">{metrics.draft}</p>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Closed / Archived
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{metrics.closed}</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-600 dark:text-amber-400">
            <Archive className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-80">
            <Input
              id="search-reqs"
              placeholder="Search by code, title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Status:</span>
              <select
                aria-label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="CLOSED">Closed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Department Filter */}
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

            {/* Employment Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Type:</span>
              <select
                aria-label="Filter by Employment Type"
                value={employmentTypeFilter}
                onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="ALL">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {(searchQuery || departmentFilter !== 'ALL' || statusFilter !== 'ALL' || employmentTypeFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDepartmentFilter('ALL');
                  setStatusFilter('ALL');
                  setEmploymentTypeFilter('ALL');
                }}
                className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Requisitions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requisition ID</TableHead>
              <TableHead>Position Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location & Type</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <Briefcase className="w-10 h-10 text-slate-400 mb-3" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No matching job requisitions found
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                      Adjust your active search query or filter selection, or create a new requisition to get started.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-4"
                      icon={<Plus className="w-3.5 h-3.5" />}
                      onClick={handleCreateOpen}
                    >
                      Create Requisition
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => {
                const applicantCount = applicantsByJob[job.id] || 0;
                const displayCode = job.reqCode || job.code;
                return (
                  <TableRow key={job.id}>
                    <TableCell className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {displayCode}
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 hover:text-primary-600 cursor-pointer">
                          {job.title}
                        </span>
                        <div className="text-[11px] text-slate-400">Created: {job.createdAt}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {job.department}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{job.location}</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span>{job.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Users className="w-3.5 h-3.5 text-primary-500" />
                        <span>{applicantCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Edit2 className="w-3.5 h-3.5" />}
                          onClick={() => handleEditOpen(job)}
                          aria-label={`Edit ${job.title}`}
                        >
                          Edit
                        </Button>

                        {/* Lifecycle quick actions */}
                        {job.status === 'DRAFT' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                            onClick={() => handleStatusChange(job.id, displayCode, 'PUBLISHED')}
                          >
                            Publish
                          </Button>
                        )}
                        {job.status === 'PUBLISHED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-700 dark:text-amber-400"
                            onClick={() => handleStatusChange(job.id, displayCode, 'CLOSED')}
                          >
                            Close
                          </Button>
                        )}
                        {job.status === 'CLOSED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-600 dark:text-slate-400"
                            onClick={() => handleStatusChange(job.id, displayCode, 'ARCHIVED')}
                          >
                            Archive
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Dialog for Create & Edit */}
      <RequisitionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRequisition}
        initialData={editingJob}
      />
    </PageContainer>
  );
}
