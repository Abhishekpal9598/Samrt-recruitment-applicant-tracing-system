import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import Button from './Button';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // Strict 5 MB ceiling
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc'];

export const ResumeDropzone = ({
  file,
  selectedFile,
  onFileSelect,
  onFileSelected,
  onFileRemove,
  error: externalError,
  label = 'Resume / Curriculum Vitae',
  required = true,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [internalError, setInternalError] = useState(null);
  const inputRef = useRef(null);

  const activeFile = selectedFile || file || null;
  const notifySelect = onFileSelected || onFileSelect || (() => {});
  const notifyRemove = onFileRemove || (() => notifySelect(null));

  const validateFile = (candidateFile) => {
    if (!candidateFile) return false;

    // Check for empty file (0 bytes)
    if (candidateFile.size === 0) {
      setInternalError(
        'The selected file is empty (0 bytes). Please upload a valid, non-empty resume document.'
      );
      return false;
    }

    // Check size limit (5MB)
    if (candidateFile.size > MAX_FILE_SIZE_BYTES) {
      setInternalError(
        `File exceeds maximum allowed size of 5 MB (${(candidateFile.size / (1024 * 1024)).toFixed(2)} MB). Please select a smaller file.`
      );
      return false;
    }

    // Check extension and MIME type
    const nameLower = candidateFile.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => nameLower.endsWith(ext));
    const hasValidMime = ALLOWED_MIME_TYPES.includes(candidateFile.type);

    if (!hasValidExtension && !hasValidMime) {
      setInternalError('Invalid format: only PDF and DOCX files are accepted.');
      return false;
    }

    setInternalError(null);
    return true;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        notifySelect(droppedFile);
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const chosenFile = e.target.files[0];
      if (validateFile(chosenFile)) {
        notifySelect(chosenFile);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '0 KB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const activeError = externalError || internalError;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      {!activeFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              inputRef.current?.click();
            }
          }}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950 ${
            isDragOver
              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30'
              : activeError
              ? 'border-danger-300 bg-danger-50/30 dark:border-danger-800 dark:bg-danger-950/20'
              : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/60 hover:border-neutral-400 dark:hover:border-neutral-600'
          }`}
        >
          <input
            id="resume-file-input"
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleInputChange}
            className="hidden"
            aria-label="Upload resume file"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                Click to upload
              </span>{' '}
              <span className="text-neutral-500 dark:text-neutral-400">or Drag & drop your resume</span>
            </div>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              PDF or DOCX format (Strict 5MB file ceiling)
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-850/60 p-3.5 flex items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-primary-100 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                  {activeFile.name}
                </p>
                <CheckCircle2 className="w-3.5 h-3.5 text-success-600 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {formatFileSize(activeFile.size)} • Ready for submission
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              notifyRemove();
            }}
            aria-label="Remove selected file"
            className="text-neutral-400 hover:text-danger-600 dark:hover:text-danger-400 p-1.5 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {activeError && (
        <p className="text-xs text-danger-600 dark:text-danger-400 flex items-center gap-1.5 pt-1" role="alert">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{activeError}</span>
        </p>
      )}
    </div>
  );
};

ResumeDropzone.propTypes = {
  file: PropTypes.object,
  selectedFile: PropTypes.object,
  onFileSelect: PropTypes.func,
  onFileSelected: PropTypes.func,
  onFileRemove: PropTypes.func,
  error: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
};

export default ResumeDropzone;
