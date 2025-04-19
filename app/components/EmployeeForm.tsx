import { Form } from 'react-router';

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
  };
  submitLabel: string;
}

export default function EmployeeForm({
  defaultValues = {},
  submitLabel,
}: EmployeeFormProps) {
  return (
    <Form method="post" className="space-y-4">
      {/* Full Name */}
      <div className="flex items-center space-x-3">
        <label
          htmlFor="full_name"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Full Name
        </label>
        <input
          type="text"
          name="full_name"
          id="full_name"
          defaultValue={defaultValues.full_name}
          required
          className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Email */}
      <div className="flex items-center space-x-3">
        <label
          htmlFor="email"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          defaultValue={defaultValues.email}
          required
          className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Phone Number */}
      <div className="flex items-center space-x-3">
        <label
          htmlFor="phone_number"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Phone
        </label>
        <input
          type="text"
          name="phone_number"
          id="phone_number"
          defaultValue={defaultValues.phone_number}
          required
          className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Date of Birth */}
      <div className="flex items-center space-x-3">
        <label
          htmlFor="date_of_birth"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          DOB
        </label>
        <input
          type="date"
          name="date_of_birth"
          id="date_of_birth"
          defaultValue={defaultValues.date_of_birth}
          required
          className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Job Title */}
      <div className="flex items-center space-x-3">
        <label
          htmlFor="job_title"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Job Title
        </label>
        <input
          type="text"
          name="job_title"
          id="job_title"
          defaultValue={defaultValues.job_title}
          required
          className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Department */}
      <div className="flex items-center space-x-3">
        <label
          htmlFor="department"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Department
        </label>
        <input
          type="text"
          name="department"
          id="department"
          defaultValue={defaultValues.department}
          required
          className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Salary */}
      <div className="flex items-center space-x-3">
        <label
          htmlFor="salary"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Salary
        </label>
        <input
          type="number"
          name="salary"
          id="salary"
          defaultValue={defaultValues.salary}
          required
          step="0.01"
          className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Start Date */}
      <div className="flex items-center space-x-3">
        <label
          htmlFor="start_date"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Start Date
        </label>
        <input
          type="date"
          name="start_date"
          id="start_date"
          defaultValue={defaultValues.start_date}
          required
          className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* End Date */}
      <div className="flex items-center space-x-3">
        <label
          htmlFor="end_date"
          className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          End Date
        </label>
        <input
          type="date"
          name="end_date"
          id="end_date"
          defaultValue={defaultValues.end_date}
          className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700 transition"
      >
        {submitLabel}
      </button>
    </Form>
  );
}
