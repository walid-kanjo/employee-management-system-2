import { redirect, type ActionFunction } from 'react-router';
import { getDB } from '~/db/getDB';
import EmployeeForm from '~/components/EmployeeForm';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const full_name = formData.get('full_name');
  const email = formData.get('email');
  const phone_number = formData.get('phone_number');
  const date_of_birth = formData.get('date_of_birth');
  const job_title = formData.get('job_title');
  const department = formData.get('department');
  const salary = formData.get('salary');
  const start_date = formData.get('start_date');
  const end_date = formData.get('end_date');

  const db = await getDB();
  await db.run(
    'INSERT INTO employees (full_name, email, phone_number, date_of_birth, job_title, department, salary, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      full_name,
      email,
      phone_number,
      date_of_birth,
      job_title,
      department,
      salary,
      start_date,
      end_date,
    ]
  );

  return redirect('/employees');
};

export default function NewEmployeePage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          Create New Employee
        </h1>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
          <EmployeeForm submitLabel="Create Employee" />
        </div>

        <hr className="my-2 border-gray-300 dark:border-gray-700" />

        <div className="flex gap-2 w-full max-w-md mx-auto mb-2">
          <a
            href="/employees"
            className="flex-1 text-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
          >
            Employees
          </a>
          <a
            href="/timesheets"
            className="flex-1 text-center px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm transition"
          >
            Timesheets
          </a>
        </div>
      </div>
    </div>
  );
}
