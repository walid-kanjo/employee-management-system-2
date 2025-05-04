import React from 'react';

interface NumberFieldProps {
  label: string;
  name: string;
  value: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  required?: boolean;
}

export default function NumberField({
  label,
  name,
  value,
  inputRef,
  onChange,
  onBlur,
  required = false,
}: NumberFieldProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
      <label
        htmlFor={name}
        className="w-full text-center sm:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 sm:mb-0"
      >
        {label}
      </label>
      <input
        ref={inputRef}
        type="number"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        step="0.01"
        className="w-full sm:flex-1 px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
