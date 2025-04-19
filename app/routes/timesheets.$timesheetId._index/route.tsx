import {
  redirect,
  type LoaderFunction,
  type ActionFunction,
  useLoaderData,
} from 'react-router';
import { getDB } from '~/db/getDB';
import TimesheetForm from '~/components/TimeSheetForm';

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.timesheetId;
  if (!id) throw new Response('Not Found', { status: 404 });
  const db = await getDB();
  const timesheet = await db.get('SELECT * FROM timesheets WHERE id = ?;', [
    id,
  ]);
  if (!timesheet) throw new Response('Timesheet not found', { status: 404 });
  const employees = await db.all('SELECT id, full_name FROM employees;');
  return { timesheet, employees };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const db = await getDB();
  await db.run(
    `UPDATE timesheets
       SET employee_id = ?,
           start_time  = ?,
           end_time    = ?,
           summary     = ?
     WHERE id = ?;`,
    [
      formData.get('employee_id'),
      formData.get('start_time'),
      formData.get('end_time'),
      formData.get('summary'),
      params.timesheetId,
    ]
  );
  return redirect('/timesheets');
};

export default function EditTimesheetPage() {
  const { timesheet, employees } = useLoaderData();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-4">
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          Edit Timesheet #{timesheet.id}
        </h1>

        {/* Form Component */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
          <TimesheetForm
            employees={employees}
            defaultValues={{
              employee_id: String(timesheet.employee_id),
              start_time: timesheet.start_time,
              end_time: timesheet.end_time,
              summary: timesheet.summary,
            }}
            submitLabel="Update Timesheet"
          />
        </div>

        {/* Footer Navigation */}
        <hr className="my-2 border-gray-300 dark:border-gray-700" />
        <div className="flex gap-2 w-full max-w-md mx-auto mb-2">
          <a
            href="/timesheets"
            className="flex-1 text-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
          >
            Timesheets
          </a>
          <a
            href="/timesheets/new"
            className="flex-1 text-center px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition"
          >
            New Timesheet
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
