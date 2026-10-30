import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResumeDropzone from '../common/ResumeDropzone';

describe('ResumeDropzone Component', () => {
  it('renders dropzone instructions and accepted formats', () => {
    render(<ResumeDropzone onFileSelected={vi.fn()} />);

    expect(screen.getByText(/Drag & drop your resume/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF or DOCX/i)).toBeInTheDocument();
  });

  it('accepts a valid PDF file under 5MB', () => {
    const handleFileSelected = vi.fn();
    render(<ResumeDropzone onFileSelected={handleFileSelected} />);

    const file = new File(['valid resume bytes'], 'candidate_cv.pdf', {
      type: 'application/pdf',
    });

    const input = document.getElementById('resume-file-input');
    fireEvent.change(input, { target: { files: [file] } });

    expect(handleFileSelected).toHaveBeenCalledWith(file);
  });

  it('rejects files larger than 5MB with an error message', () => {
    const handleFileSelected = vi.fn();
    render(<ResumeDropzone onFileSelected={handleFileSelected} />);

    // Create a 6MB mock file
    const largeFile = new File(['x'.repeat(1024)], 'large_cv.pdf', {
      type: 'application/pdf',
    });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

    const input = document.getElementById('resume-file-input');
    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(handleFileSelected).not.toHaveBeenCalled();
    expect(screen.getByText(/File exceeds maximum allowed size of 5 MB/i)).toBeInTheDocument();
  });

  it('rejects unsupported file formats like executable or image', () => {
    const handleFileSelected = vi.fn();
    render(<ResumeDropzone onFileSelected={handleFileSelected} />);

    const invalidFile = new File(['image bytes'], 'picture.png', {
      type: 'image/png',
    });

    const input = document.getElementById('resume-file-input');
    fireEvent.change(input, { target: { files: [invalidFile] } });

    expect(handleFileSelected).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Invalid format: only PDF and DOCX files are accepted/i)
    ).toBeInTheDocument();
  });

  it('rejects empty 0-byte files with an error message', () => {
    const handleFileSelected = vi.fn();
    render(<ResumeDropzone onFileSelected={handleFileSelected} />);

    const emptyFile = new File([], 'empty_cv.pdf', {
      type: 'application/pdf',
    });
    Object.defineProperty(emptyFile, 'size', { value: 0 });

    const input = document.getElementById('resume-file-input');
    fireEvent.change(input, { target: { files: [emptyFile] } });

    expect(handleFileSelected).not.toHaveBeenCalled();
    expect(screen.getByText(/The selected file is empty \(0 bytes\)/i)).toBeInTheDocument();
  });

  it('renders selected file metadata and supports file removal', () => {
    const handleFileSelected = vi.fn();
    const file = new File(['content'], 'sarah_resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 150000 });

    render(<ResumeDropzone selectedFile={file} onFileSelected={handleFileSelected} />);

    expect(screen.getByText('sarah_resume.pdf')).toBeInTheDocument();
    expect(screen.getByText(/146 KB/)).toBeInTheDocument();

    const removeBtn = screen.getByLabelText('Remove selected file');
    fireEvent.click(removeBtn);

    expect(handleFileSelected).toHaveBeenCalledWith(null);
  });
});
