import React from 'react';

interface Document {
  originalName: string;
  storedPath: string;
}

interface DocumentUploaderProps {
  docsFiles: File[];
  existingDocs: Document[];
  inputRef: React.RefObject<HTMLInputElement | null>;

  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onRemoveNew: (idx: number) => void;
  onRemoveExisting: (idx: number) => void;
  onPreview: (url: string) => void;
}

export default function DocumentUploader({
  docsFiles,
  existingDocs,
  inputRef,
  onChange,
  onRemoveNew,
  onRemoveExisting,
  onPreview,
}: DocumentUploaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
      <label className="w-full text-center sm:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 sm:mb-0">
        Documents
      </label>
      <div className="w-full sm:flex-1 space-y-2">
        {(docsFiles.length > 0 || existingDocs.length > 0) && (
          <ul className="space-y-2">
            {docsFiles.map((f, i) => (
              <li
                key={`new-${i}`}
                className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <span
                  onClick={() => onPreview(URL.createObjectURL(f))}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate"
                >
                  {f.name}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveNew(i)}
                  className="cursor-pointer ml-4 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </li>
            ))}
            {existingDocs.map((doc, i) => (
              <li
                key={`old-${i}`}
                className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <span
                  onClick={() => onPreview(doc.storedPath)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate"
                >
                  {doc.originalName}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveExisting(i)}
                  className="cursor-pointer ml-4 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
                <input
                  type="hidden"
                  name="existing_documents"
                  value={doc.storedPath}
                />
              </li>
            ))}
          </ul>
        )}
        <label
          htmlFor="documents"
          className="block w-full text-center cursor-pointer px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-green-50 dark:bg-green-800 text-green-700 dark:text-green-200 hover:bg-green-100 transition text-sm"
        >
          Click to choose documents (CV, ID, Image...)
        </label>
        <input
          ref={inputRef}
          type="file"
          name="documents"
          id="documents"
          accept=".pdf,.doc,.docx,image/*"
          multiple
          onChange={onChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
