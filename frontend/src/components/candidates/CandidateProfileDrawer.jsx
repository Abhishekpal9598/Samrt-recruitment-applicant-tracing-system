import { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Briefcase,
  Calendar,
  FileText,
  Clock,
  Download,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { ALLOWED_STAGE_TRANSITIONS, STAGE_DISPLAY_NAMES } from '../../pages/HRPipelinePage';

export const CandidateProfileDrawer = ({
  candidate,
  isOpen,
  onClose,
  onStageChange,
  onAddNote,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newNoteText, setNewNoteText] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !candidate) return null;

  const currentStage = candidate.application?.stage || 'APPLIED';
  const allowedNextStages = ALLOWED_STAGE_TRANSITIONS[currentStage] || [];
  const isTerminal = allowedNextStages.length === 0;

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    if (onAddNote) {
      onAddNote(candidate.id, newNoteText);
    }
    setNewNoteText('');
  };

  const handleDownloadResume = () => {
    const resume = candidate.application?.resume || candidate.resume;
    if (!resume) return;
    // Simulate streaming verified resume fixture for demonstration audit
    const element = document.createElement('a');
    const fileContent = `[DEMONSTRATION ONLY - ATS PHASE 2.2 PROTOTYPE]\nSimulated Candidate Resume Document:\nName: ${candidate.name}\nEmail: ${candidate.email}\nPhone: ${candidate.phone}\nSkills: ${candidate.skills?.join(', ') || 'N/A'}\n\nProfile Summary:\n${resume.summarySnippet || 'Simulated demonstration credentials.'}`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(blob);
    const rawName = resume.originalName || resume.fileName || 'resume_document.pdf';
    element.download = `SIMULATED_${rawName.replace(/\.[^/.]+$/, '')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-drawer flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 id="drawer-title" className="text-xl font-bold text-neutral-900 dark:text-white truncate">
                    {candidate.name}
                  </h2>
                  <Badge stage={currentStage} />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Applied for <span className="font-semibold text-neutral-700 dark:text-neutral-300">{candidate.application?.jobTitle}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Close candidate drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stage Transition Control in Drawer Header */}
            <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                Pipeline Stage:
              </span>
              {isTerminal ? (
                <span className="text-xs italic text-neutral-400">Stage Finalized ({STAGE_DISPLAY_NAMES[currentStage]})</span>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    aria-label="Change candidate stage"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value && onStageChange) {
                        onStageChange(candidate.id, e.target.value);
                      }
                    }}
                    className="text-xs py-1 px-2.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-subtle focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="" disabled>
                      Move to next stage...
                    </option>
                    {allowedNextStages.map((stageKey) => (
                      <option key={stageKey} value={stageKey}>
                        {STAGE_DISPLAY_NAMES[stageKey] || stageKey}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-6 mt-6 border-b border-neutral-200 dark:border-neutral-800 -mb-6">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'timeline', label: 'Stage Timeline' },
                { key: 'resume', label: 'Resume & Proof' },
                { key: 'notes', label: `Internal Notes (${candidate.application?.notes?.length || 0})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drawer Body Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Contact Card */}
                <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/40 p-4 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Contact & Sourcing</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                      <Mail className="w-4 h-4 text-neutral-400" />
                      <a href={`mailto:${candidate.email}`} className="hover:underline truncate">{candidate.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                      <Phone className="w-4 h-4 text-neutral-400" />
                      <span>{candidate.phone}</span>
                    </div>
                    {candidate.linkedinUrl && (
                      <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                        <Linkedin className="w-4 h-4 text-primary-600" />
                        <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">LinkedIn Profile</a>
                      </div>
                    )}
                    {candidate.portfolioUrl && (
                      <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                        <Globe className="w-4 h-4 text-indigo-500" />
                        <a href={candidate.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">Portfolio / GitHub</a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Background */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Experience & Skills</h4>
                  <div className="flex items-center gap-4 text-xs text-neutral-700 dark:text-neutral-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Briefcase className="w-4 h-4 text-neutral-400" /> {candidate.currentRole}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-neutral-400" /> {candidate.yearsOfExperience} Years Exp
                    </span>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Verified Skill Tags:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.map((skill, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium border border-neutral-200 dark:border-neutral-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Timeline & Stage History */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Application Stage Audit Log</h4>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
                  {candidate.application?.history?.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-primary-600 border-2 border-white dark:border-neutral-900" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">
                            {STAGE_DISPLAY_NAMES[step.stage] || step.stage}
                          </span>
                          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {step.date}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                          By: {step.changedBy}
                        </p>
                        {step.notes && (
                          <p className="mt-1.5 text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-850 p-2.5 rounded border border-neutral-200 dark:border-neutral-800">
                            {step.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Resume Document & Metadata */}
            {activeTab === 'resume' && (
              <div className="space-y-5">
                <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50/50 dark:bg-neutral-850/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-primary-600" />
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                          {candidate.application?.resume?.originalName || 'Resume_Document.pdf'}
                        </h4>
                        <p className="text-[11px] text-neutral-400">
                          {candidate.application?.resume?.fileSizeBytes
                            ? `${(candidate.application.resume.fileSizeBytes / 1024).toFixed(1)} KB`
                            : '240 KB'}{' '}
                          • {candidate.application?.resume?.mimeType || 'application/pdf'}
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" leftIcon={Download} onClick={handleDownloadResume}>
                      Download (Simulated)
                    </Button>
                  </div>

                  <div className="pt-2 text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1 font-mono border-t border-neutral-200 dark:border-neutral-800">
                    <p className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
                      Client Pre-Check: Format & Size Validated (Phase 3 Backend Magic-Byte)
                    </p>
                    <p className="truncate">
                      SHA-256 Hash: {candidate.application?.resume?.fileHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'} (Simulated)
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Resume Summary Extraction</h4>
                  <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {candidate.application?.resume?.summarySnippet || 'Structured summary not available for this candidate fixture.'}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Internal Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Recruiter Collaboration Notes</h4>

                {/* Add Note Form */}
                <form onSubmit={handleNoteSubmit} className="space-y-2.5">
                  <textarea
                    rows={3}
                    placeholder="Enter confidential internal candidate evaluation note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="w-full text-xs p-3 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" leftIcon={Plus} disabled={!newNoteText.trim()}>
                      Add Note
                    </Button>
                  </div>
                </form>

                {/* Notes List */}
                <div className="space-y-3 pt-2">
                  {(!candidate.application?.notes || candidate.application.notes.length === 0) ? (
                    <p className="text-xs text-neutral-400 italic text-center py-4">No internal notes recorded yet.</p>
                  ) : (
                    candidate.application.notes.map((note) => (
                      <div key={note.id} className="p-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-neutral-500">
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200">{note.author}</span>
                          <span>{note.date}</span>
                        </div>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-mono">App ID: {candidate.application?.id}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close Drawer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileDrawer;
