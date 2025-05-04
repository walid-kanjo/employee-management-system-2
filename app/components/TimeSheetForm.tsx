import { Form } from 'react-router';
import { useRef, useState } from 'react';

interface Employee {
  id: number;
  full_name: string;
}

interface TimesheetFormProps {
  employees: Employee[];
  defaultValues?: {
    employee_id?: string;
    start_time?: string;
    end_time?: string;
    summary?: string;
  };
  submitLabel: string;
}

export default function TimesheetForm({
  employees,
  defaultValues = {},
  submitLabel,
}: TimesheetFormProps) {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const [timeError, setTimeError] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    defaultValues.employee_id ?? ''
  );

  function validateTimeOrder() {
    const startVal = startRef.current?.value;
    const endVal = endRef.current?.value;
    let err = '';

    if (startVal && endVal) {
      if (new Date(startVal) >= new Date(endVal)) {
        err = 'End time must be after Start time';
        startRef.current!.value = '';
        endRef.current!.value = '';
      }
    }

    setTimeError(err || null);
  }

  return (
    <Form method="post" className="space-y-3">
      {/* Employee Select */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="employee_id"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Employee
        </label>
        <select
          name="employee_id"
          id="employee_id"
          defaultValue={defaultValues.employee_id ?? ''}
          required
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="" disabled>
            — select —
          </option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Link */}
      <div className="flex items-center space-x-2">
        {/* spacer to align with the label */}
        <div className="w-1/3" />
        <a
          href={selectedEmployeeId ? `/employees/${selectedEmployeeId}` : '#'}
          className={`flex-1 px-3 py-1 text-sm font-semibold rounded text-center transition
            ${
              selectedEmployeeId
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed pointer-events-none'
            }`}
        >
          Edit Employee
        </a>
      </div>

      {/* Time-order error */}
      {timeError && <div className="text-red-600 text-sm">{timeError}</div>}

      {/* Start Time */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="start_time"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Start
        </label>
        <input
          ref={startRef}
          type="datetime-local"
          name="start_time"
          id="start_time"
          defaultValue={defaultValues.start_time}
          required
          onBlur={validateTimeOrder}
          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* End Time */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="end_time"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          End
        </label>
        <input
          ref={endRef}
          type="datetime-local"
          name="end_time"
          id="end_time"
          defaultValue={defaultValues.end_time}
          required
          onBlur={validateTimeOrder}
          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Summary */}
      <div className="flex items-start space-x-2">
        <label
          htmlFor="summary"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={4}
          defaultValue={defaultValues.summary}
          required
          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-3 py-1 bg-orange-600 text-white text-sm font-semibold rounded hover:bg-orange-700 transition"
      >
        {submitLabel}
      </button>
    </Form>
  );
}
