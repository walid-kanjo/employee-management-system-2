import { useLoaderData, redirect, type ActionFunction } from 'react-router';
import { getDB } from '~/db/getDB';
import TimesheetForm from '~/components/TimeSheetForm';

export async function loader() {
  const db = await getDB();
  const employees = await db.all('SELECT id, full_name FROM employees');
  return { employees };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get('employee_id');
  const start_time = formData.get('start_time');
  const end_time = formData.get('end_time');
  const summary = formData.get('summary');

  const db = await getDB();
  await db.run(
    'INSERT INTO timesheets (employee_id, start_time, end_time, summary) VALUES (?, ?, ?, ?)',
    [employee_id, start_time, end_time, summary]
  );

  return redirect('/timesheets');
};

export default function NewTimesheetPage() {
  const { employees } = useLoaderData();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          Create New Timesheet
        </h1>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
          <TimesheetForm employees={employees} submitLabel="Create Timesheet" />
        </div>

        <hr className="my-2 border-gray-300 dark:border-gray-700" />

        <div className="flex gap-2 w-full max-w-md mx-auto mb-2">
          <a
            href="/timesheets"
            className="flex-1 text-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
          >
            Timesheets
          </a>
          <a
            href="/employees"
            className="flex-1 text-center px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm transition"
          >
            Employees
          </a>
        </div>
      </div>
    </div>
  );
}
