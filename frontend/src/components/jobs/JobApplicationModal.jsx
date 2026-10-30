import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  User,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import ResumeDropzone from '../common/ResumeDropzone';
import { useRecruitment } from '../../context/RecruitmentContext';

/**
 * JobApplicationModal
 * Multi-step Enterprise candidate application modal.
 * Step 1: Candidate Contact & Professional Profile
 * Step 2: Resume Ingestion & Validation
 * Step 3: Application Review & Consent
 * Step 4: Submission Confirmation with Tracking ID
 */
export default function JobApplicationModal({ isOpen, onClose, job }) {
  const { submitApplication } = useRecruitment();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    portfolioUrl: '',
    currentCompany: '',
    noticePeriodDays: '',
    workAuthorization: 'CITIZEN',
    coverNote: '',
    consentPrivacy: false,
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  if (!isOpen || !job) return null;

  const resetForm = () => {
    setStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      linkedinUrl: '',
      portfolioUrl: '',
      currentCompany: '',
      noticePeriodDays: '',
      workAuthorization: 'CITIZEN',
      coverNote: '',
      consentPrivacy: false,
    });
    setResumeFile(null);
    setErrors({});
    setIsSubmitting(false);
    setSubmissionResult(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[+0-9\s\-().]{8,20}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (formData.linkedinUrl && !formData.linkedinUrl.startsWith('http')) {
      errs.linkedinUrl = 'URL must start with http:// or https://';
    }
    if (formData.portfolioUrl && !formData.portfolioUrl.startsWith('http')) {
      errs.portfolioUrl = 'URL must start with http:// or https://';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!resumeFile) {
      errs.resume = 'A resume in PDF or DOCX format is required (maximum 5MB)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.consentPrivacy) {
      errs.consentPrivacy = 'You must confirm data processing consent to submit your application';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 4) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    try {
      // Simulate slight network latency for realistic SaaS feel
      await new Promise((res) => setTimeout(res, 600));

      const applicationPayload = {
        jobId: job.id,
        jobTitle: job.title,
        department: job.department,
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        linkedinUrl: formData.linkedinUrl.trim(),
        portfolioUrl: formData.portfolioUrl.trim(),
        currentCompany: formData.currentCompany.trim(),
        noticePeriodDays: formData.noticePeriodDays ? parseInt(formData.noticePeriodDays, 10) : 30,
        workAuthorization: formData.workAuthorization,
        coverNote: formData.coverNote.trim(),
        resume: {
          fileName: resumeFile.name,
          fileSize: resumeFile.size,
          fileType: resumeFile.type,
          uploadedAt: new Date().toISOString(),
        },
      };

      const newCandidate = submitApplication(applicationPayload);
      setSubmissionResult(newCandidate);
      setStep(4);
    } catch (err) {
      setErrors({ submission: err.message || 'Failed to submit application. Please retry.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Apply for Position
            </span>
            <h2 id="apply-modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{job.department}</span>
              <span>•</span>
              <span>{job.location}</span>
              <span>•</span>
              <span>{job.type}</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
            aria-label="Close application dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker (Steps 1-3) */}
        {step < 4 && (
          <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: 'Candidate Details' },
                { num: 2, label: 'Resume Upload' },
                { num: 3, label: 'Review & Submit' },
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step === s.num
                        ? 'bg-primary-600 text-white shadow-sm ring-2 ring-primary-100 dark:ring-primary-900/50'
                        : step > s.num
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:inline ${
                      step === s.num
                        ? 'text-slate-900 dark:text-slate-100 font-semibold'
                        : step > s.num
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                  {idx < 2 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-colors ${
                        step > s.num ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {errors.submission && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.submission}</span>
            </div>
          )}

          {/* STEP 1: Personal & Professional Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  required
                  placeholder="e.g. Elena"
                />
                <Input
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  required
                  placeholder="e.g. Vance"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                  placeholder="elena.vance@example.com"
                  helperText="Application updates will be sent to this address."
                />
                <Input
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  required
                  placeholder="+1 (555) 234-5678"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="LinkedIn Profile URL"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  error={errors.linkedinUrl}
                  placeholder="https://linkedin.com/in/username"
                />
                <Input
                  label="Portfolio or GitHub URL"
                  id="portfolioUrl"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  error={errors.portfolioUrl}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Current Employer / Organization"
                  id="currentCompany"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleInputChange}
                  placeholder="e.g. Current Corp (Optional)"
                />
                <div>
                  <label
                    htmlFor="workAuthorization"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Work Authorization Status
                  </label>
                  <select
                    id="workAuthorization"
                    name="workAuthorization"
                    value={formData.workAuthorization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="CITIZEN">Citizen / Permanent Resident</option>
                    <option value="VISA_AUTHORIZED">Authorized (No Sponsorship Required)</option>
                    <option value="NEEDS_SPONSORSHIP">Requires Sponsorship (H-1B, TN, etc.)</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="coverNote"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Cover Note / Introduction (Optional)
                </label>
                <textarea
                  id="coverNote"
                  name="coverNote"
                  rows={3}
                  value={formData.coverNote}
                  onChange={handleInputChange}
                  placeholder="Share a brief overview of why your background is a strong fit for this role..."
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-400"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Resume Ingestion */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Upload Resume / Curriculum Vitae
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Our recruitment team evaluates candidates against verified professional credentials.
                  Upload your most recent CV in PDF or DOCX format (max 5 MB).
                </p>
              </div>

              <ResumeDropzone
                onFileSelected={(file) => {
                  setResumeFile(file);
                  if (errors.resume) setErrors((prev) => ({ ...prev, resume: null }));
                }}
                selectedFile={resumeFile}
                error={errors.resume}
              />

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Client-Side Prototype Verification:
                  </span>{' '}
                  Documents are validated locally in this demonstration environment. Production server-side
                  storage (Phase 3 backend) incorporates automated antivirus scanning, magic-byte inspection,
                  and AES-256 encryption at rest.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review Application */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Applicant Summary
                    </span>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    Edit details
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <span className="text-slate-400">Full Name:</span>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {formData.firstName} {formData.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Phone:</span>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{formData.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Target Role:</span>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{job.title}</p>
                  </div>
                  {formData.linkedinUrl && (
                    <div className="col-span-2">
                      <span className="text-slate-400">LinkedIn:</span>
                      <p className="font-medium text-primary-600 dark:text-primary-400 truncate">
                        {formData.linkedinUrl}
                      </p>
                    </div>
                  )}
                </div>

                {/* Resume block */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {resumeFile?.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({(resumeFile?.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    Change file
                  </button>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="space-y-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    id="consentPrivacy"
                    name="consentPrivacy"
                    checked={formData.consentPrivacy}
                    onChange={handleInputChange}
                    className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    I confirm that the submitted information is accurate and consent to my data being processed
                    by the recruitment and talent acquisition teams for this and future relevant openings.
                  </span>
                </label>
                {errors.consentPrivacy && (
                  <p className="text-xs text-red-600 dark:text-red-400 pl-6">{errors.consentPrivacy}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Submission Confirmation Screen */}
          {step === 4 && submissionResult && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Application Submitted Successfully
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Thank you for applying to{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {submissionResult.jobTitle}
                  </span>
                  . Your application has been logged into the ATS pipeline and assigned to our recruiting team.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Application Reference ID:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                    {submissionResult.applicationId || submissionResult.id}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Candidate Name:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{submissionResult.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Initial Pipeline Stage:</span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {submissionResult.stage}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Submitted Timestamp:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {new Date(submissionResult.appliedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  You can track your real-time stage progression anytime in the Candidate Portal.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          {step < 4 ? (
            <>
              {step > 1 ? (
                <Button variant="ghost" size="sm" onClick={handleBack} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  Cancel
                </Button>
              )}

              {step < 3 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNext}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Submit Application
                </Button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center justify-end gap-3">
              <Button variant="secondary" size="sm" onClick={handleClose}>
                Close
              </Button>
              <a
                href="/portal"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
              >
                <span>Track in Candidate Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

JobApplicationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  job: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
};
