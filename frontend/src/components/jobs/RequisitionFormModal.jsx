import { useState, useEffect } from 'react';
import Dialog from '../common/Dialog';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import { useRecruitment } from '../../context/RecruitmentContext';

const EMPLOYMENT_TYPES = [
  { label: 'Full-Time', value: 'FULL_TIME' },
  { label: 'Part-Time', value: 'PART_TIME' },
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Internship', value: 'INTERNSHIP' },
  { label: 'Remote Only', value: 'REMOTE' },
];

const EXPERIENCE_LEVELS = [
  { label: 'Entry-Level', value: 'ENTRY_LEVEL' },
  { label: 'Mid-Level', value: 'MID_LEVEL' },
  { label: 'Senior-Level', value: 'SENIOR_LEVEL' },
  { label: 'Lead / Staff', value: 'LEAD' },
  { label: 'Executive', value: 'EXECUTIVE' },
];

const JOB_STATUSES = [
  { label: 'Draft (Internal Review)', value: 'DRAFT' },
  { label: 'Published (Active on Board)', value: 'PUBLISHED' },
  { label: 'Closed (Hiring Paused)', value: 'CLOSED' },
  { label: 'Archived', value: 'ARCHIVED' },
];

export const RequisitionFormModal = ({
  isOpen,
  onClose,
  initialJob = null,
  onSave,
}) => {
  const { departments } = useRecruitment();

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID_LEVEL',
    location: 'Remote',
    minSalary: '',
    maxSalary: '',
    deadline: '',
    status: 'DRAFT',
    skills: '',
    description: '',
    requirements: '',
    benefits: 'Comprehensive healthcare, 401(k), flexible PTO.',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialJob) {
      setFormData({
        title: initialJob.title || '',
        department: initialJob.department || 'Engineering',
        employmentType: initialJob.employmentType || 'FULL_TIME',
        experienceLevel: initialJob.experienceLevel || 'MID_LEVEL',
        location: initialJob.location || '',
        minSalary: initialJob.minSalary ? String(initialJob.minSalary) : '',
        maxSalary: initialJob.maxSalary ? String(initialJob.maxSalary) : '',
        deadline: initialJob.deadline ? initialJob.deadline.substring(0, 10) : '',
        status: initialJob.status || 'DRAFT',
        skills: Array.isArray(initialJob.skills) ? initialJob.skills.join(', ') : initialJob.skills || '',
        description: initialJob.description || '',
        requirements: initialJob.requirements || '',
        benefits: initialJob.benefits || 'Comprehensive healthcare, 401(k), flexible PTO.',
      });
    } else {
      setFormData({
        title: '',
        department: 'Engineering',
        employmentType: 'FULL_TIME',
        experienceLevel: 'MID_LEVEL',
        location: 'Remote',
        minSalary: '',
        maxSalary: '',
        deadline: '',
        status: 'DRAFT',
        skills: '',
        description: '',
        requirements: '',
        benefits: 'Comprehensive healthcare, 401(k), flexible PTO.',
      });
    }
    setErrors({});
  }, [initialJob, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Job title is required';
    } else if (formData.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters';
    }

    if (!formData.location.trim()) {
      errs.location = 'Location is required';
    }

    if (!formData.description.trim()) {
      errs.description = 'Job description is required';
    } else if (formData.description.trim().length < 20) {
      errs.description = 'Description must be at least 20 characters';
    }

    if (!formData.requirements.trim()) {
      errs.requirements = 'Requirements are required';
    } else if (formData.requirements.trim().length < 20) {
      errs.requirements = 'Requirements must be at least 20 characters';
    }

    if (formData.minSalary && formData.maxSalary) {
      const min = Number(formData.minSalary);
      const max = Number(formData.maxSalary);
      if (min < 0 || max < 0) {
        errs.salary = 'Salary cannot be negative';
      } else if (min > max) {
        errs.salary = 'Minimum salary cannot exceed maximum salary';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      skills: formData.skills
        ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    });

    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialJob ? `Edit Requisition: ${initialJob.code}` : 'Create Job Requisition'}
      description="Configure job requisition parameters, compensation, and publishing state."
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialJob ? 'Save Requisition Changes' : 'Create Requisition'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Row 1: Title & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Position Title"
            required
            placeholder="e.g. Senior Full-Stack Engineer"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
          />

          <Dropdown
            label="Department"
            options={departments.map((d) => ({ label: d.name, value: d.name }))}
            value={formData.department}
            onChange={(val) => setFormData({ ...formData, department: val })}
          />
        </div>

        {/* Row 2: Type, Level, Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Dropdown
            label="Employment Type"
            options={EMPLOYMENT_TYPES}
            value={formData.employmentType}
            onChange={(val) => setFormData({ ...formData, employmentType: val })}
          />

          <Dropdown
            label="Experience Level"
            options={EXPERIENCE_LEVELS}
            value={formData.experienceLevel}
            onChange={(val) => setFormData({ ...formData, experienceLevel: val })}
          />

          <Input
            label="Location"
            required
            placeholder="e.g. Remote / New York"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            error={errors.location}
          />
        </div>

        {/* Row 3: Compensation & Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Min Salary (USD)"
            type="number"
            placeholder="120000"
            value={formData.minSalary}
            onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
            error={errors.salary}
          />

          <Input
            label="Max Salary (USD)"
            type="number"
            placeholder="160000"
            value={formData.maxSalary}
            onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
          />

          <Input
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>

        {/* Row 4: Status & Skills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Dropdown
            label="Requisition State"
            options={JOB_STATUSES}
            value={formData.status}
            onChange={(val) => setFormData({ ...formData, status: val })}
          />

          <Input
            label="Required Skills (Comma separated)"
            placeholder="React.js, Node.js, PostgreSQL"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          />
        </div>

        {/* Row 5: Description */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
            Role Description <span className="text-danger-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Detail core responsibilities, team mission, and impact..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full text-xs p-3 rounded-md border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
              errors.description ? 'border-danger-500' : 'border-neutral-300 dark:border-neutral-700'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-danger-600" role="alert">
              {errors.description}
            </p>
          )}
        </div>

        {/* Row 6: Requirements */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
            Qualifications & Requirements <span className="text-danger-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="List mandatory technical proficiencies, education, or years of domain experience..."
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            className={`w-full text-xs p-3 rounded-md border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
              errors.requirements ? 'border-danger-500' : 'border-neutral-300 dark:border-neutral-700'
            }`}
          />
          {errors.requirements && (
            <p className="mt-1 text-xs text-danger-600" role="alert">
              {errors.requirements}
            </p>
          )}
        </div>
      </form>
    </Dialog>
  );
};

export default RequisitionFormModal;
