import React from 'react';

interface PhotoUploaderProps {
  existingPhoto: string | null;
  photoFile: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onRemove: () => void;
  onPreview: (url: string) => void;
}

export default function PhotoUploader({
  existingPhoto,
  photoFile,
  inputRef,
  onChange,
  onRemove,
  onPreview,
}: PhotoUploaderProps) {
  const displayUrl = photoFile
    ? URL.createObjectURL(photoFile)
    : existingPhoto!;

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
      <label className="w-full text-center sm:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 sm:mb-0">
        Photo
      </label>
      <div className="w-full sm:flex-1">
        {photoFile || existingPhoto ? (
          <div className="relative inline-block cursor-pointer">
            <img
              src={displayUrl}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-md border"
              onClick={() => onPreview(displayUrl)}
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center cursor-pointer"
            >
              ×
            </button>
          </div>
        ) : (
          <label
            htmlFor="photo"
            className="block w-full text-center cursor-pointer px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-100 transition text-sm"
          >
            Click to choose photo (profile picture)
          </label>
        )}
        <input
          ref={inputRef}
          type="file"
          name="photo"
          id="photo"
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
        {existingPhoto && (
          <input type="hidden" name="existing_photo" value={existingPhoto} />
        )}
      </div>
    </div>
  );
}
