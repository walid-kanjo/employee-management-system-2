import React, { useState, useRef } from 'react';
import { Form } from 'react-router';

import ErrorSummary from './ErrorSummary';
import TextField from './TextField';
import DateField from './DateField';
import NumberField from './NumberField';
import PreviewModal from './PreviewModal';
import PhotoUploader from './PhotoUploader';
import DocumentUploader from './DocumentUploader';

export interface EmployeeFormProps {
  defaultValues?: {
    full_name?: string;
    email?: string;
    phone_number?: string;
    date_of_birth?: string;
    job_title?: string;
    department?: string;
    salary?: number | string;
    start_date?: string;
    end_date?: string;
    photo?: string | null;
    documents?: { originalName: string; storedPath: string }[] | null;
  };
  submitLabel: string;
}

export default function EmployeeForm({
  defaultValues = {},
  submitLabel,
}: EmployeeFormProps) {
  // Refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docsInputRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const salaryRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // State
  const [salary, setSalary] = useState(defaultValues.salary?.toString() ?? '');
  const [existingPhoto, setExistingPhoto] = useState<string | null>(
    defaultValues.photo ?? null
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [existingDocs, setExistingDocs] = useState<
    { originalName: string; storedPath: string }[]
  >(defaultValues.documents ?? []);
  const [docsFiles, setDocsFiles] = useState<File[]>([]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'doc' | null>(null);

  const [dobError, setDobError] = useState<string | null>(null);
  const [salaryError, setSalaryError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  // Handlers
  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoFile(e.target.files?.[0] ?? null);
  }
  function removePhoto() {
    if (photoFile) {
      setPhotoFile(null);
      photoInputRef.current!.value = '';
    } else {
      setExistingPhoto(null);
    }
  }

  function onDocsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files || []);
    const combined = [...docsFiles, ...newFiles];
    setDocsFiles(combined);
    const dt = new DataTransfer();
    combined.forEach((f) => dt.items.add(f));
    docsInputRef.current!.files = dt.files;
  }
  function removeDocFile(idx: number) {
    const updated = docsFiles.filter((_, i) => i !== idx);
    setDocsFiles(updated);
    const dt = new DataTransfer();
    updated.forEach((f) => dt.items.add(f));
    docsInputRef.current!.files = dt.files;
  }
  function removeExistingDoc(idx: number) {
    setExistingDocs((prev) => prev.filter((_, i) => i !== idx));
  }

  function openPreview(url: string, type: 'image' | 'doc') {
    setPreviewUrl(url);
    setPreviewType(type);
  }
  function closePreview() {
    setPreviewUrl(null);
    setPreviewType(null);
  }

  function handleDobChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (!val) {
      setDobError(null);
      return;
    }
    const entered = new Date(val);
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 18);
    if (isNaN(entered.getTime()) || entered > cutoff) {
      setDobError('Age must be more than 18');
      dobRef.current!.value = '';
    } else {
      setDobError(null);
    }
  }

  function handleSalaryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (!val) {
      setSalaryError(null);
      return;
    }
    const num = parseFloat(val);
    if (isNaN(num) || num < 1000) {
      setSalaryError('Salary must be more than 1,000');
      salaryRef.current!.value = '';
    } else {
      setSalaryError(null);
    }
  }

  function validateDateOrder() {
    const dobVal = dobRef.current?.value;
    const startVal = startDateRef.current?.value;
    const endVal = endDateRef.current?.value;
    let err = '';
    let clearDob = false,
      clearStart = false,
      clearEnd = false;

    if (dobVal && startVal && new Date(dobVal) >= new Date(startVal)) {
      err = 'DOB must be before Start Date';
      clearDob = clearStart = true;
    }
    if (!err && startVal && endVal && new Date(startVal) >= new Date(endVal)) {
      err = 'Start Date must be before End Date';
      clearStart = clearEnd = true;
    }

    if (clearDob) dobRef.current!.value = '';
    if (clearStart) startDateRef.current!.value = '';
    if (clearEnd) endDateRef.current!.value = '';
    setDateError(err || null);
  }

  return (
    <div className="mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg relative">
      {previewUrl && (
        <PreviewModal
          url={previewUrl}
          type={previewType!}
          onClose={closePreview}
        />
      )}

      <Form
        method="post"
        encType="multipart/form-data"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-20"
      >
        <h3 className="col-span-full text-xl font-semibold text-gray-800 dark:text-gray-100">
          Personal Information
        </h3>

        <ErrorSummary
          dobError={dobError}
          salaryError={salaryError}
          dateError={dateError}
        />

        <input
          type="hidden"
          name="original_photo"
          value={defaultValues.photo ?? ''}
        />
        <input
          type="hidden"
          name="original_documents"
          value={JSON.stringify(defaultValues.documents ?? [])}
        />

        <TextField
          label="Full Name"
          name="full_name"
          defaultValue={defaultValues.full_name}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          defaultValue={defaultValues.email}
          required
        />
        <TextField
          label="Phone"
          name="phone_number"
          defaultValue={defaultValues.phone_number}
          required
        />

        <DateField
          label="DOB"
          name="date_of_birth"
          defaultValue={defaultValues.date_of_birth}
          inputRef={dobRef}
          onChange={handleDobChange}
          onBlur={validateDateOrder}
          required
        />

        <TextField
          label="Job Title"
          name="job_title"
          defaultValue={defaultValues.job_title}
          required
        />
        <TextField
          label="Department"
          name="department"
          defaultValue={defaultValues.department}
          required
        />

        <NumberField
          label="Salary"
          name="salary"
          value={salary}
          inputRef={salaryRef}
          onChange={(e) => {
            setSalary(e.target.value);
            handleSalaryChange(e);
          }}
          onBlur={(e) => {
            const num = parseFloat(e.target.value);
            if (isNaN(num) || num < 1000) {
              setSalary('');
              setSalaryError('Salary must be more than 1,000');
            } else {
              setSalaryError(null);
            }
          }}
          required
        />

        <DateField
          label="Start Date"
          name="start_date"
          defaultValue={defaultValues.start_date}
          inputRef={startDateRef}
          onBlur={validateDateOrder}
          required
        />
        <DateField
          label="End Date"
          name="end_date"
          defaultValue={defaultValues.end_date ?? ''}
          inputRef={endDateRef}
          onBlur={validateDateOrder}
        />

        <PhotoUploader
          existingPhoto={existingPhoto}
          photoFile={photoFile}
          inputRef={photoInputRef}
          onChange={onPhotoChange}
          onRemove={removePhoto}
          onPreview={(url) => openPreview(url, 'image')}
        />

        <DocumentUploader
          docsFiles={docsFiles}
          existingDocs={existingDocs}
          inputRef={docsInputRef}
          onChange={onDocsChange}
          onRemoveNew={removeDocFile}
          onRemoveExisting={removeExistingDoc}
          onPreview={(url) => openPreview(url, 'doc')}
        />

        <button
          type="submit"
          className="col-span-full w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md transition"
        >
          {submitLabel}
        </button>
      </Form>
    </div>
  );
}
