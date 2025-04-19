import { Form } from 'react-router';

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
          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="" disabled>
            — select —
          </option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.full_name}
            </option>
          ))}
        </select>
      </div>

      {/* Start Time */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="start_time"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Start
        </label>
        <input
          type="datetime-local"
          name="start_time"
          id="start_time"
          defaultValue={defaultValues.start_time}
          required
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
          type="datetime-local"
          name="end_time"
          id="end_time"
          defaultValue={defaultValues.end_time}
          required
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
