import {
  redirect,
  type LoaderFunction,
  type ActionFunction,
  useLoaderData,
} from 'react-router';
import { getDB } from '~/db/getDB';
import EmployeeForm from '~/components/EmployeeForm';

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.employeeId;
  if (!id) throw new Response('Not Found', { status: 404 });

  const db = await getDB();
  const employee = await db.get('SELECT * FROM employees WHERE id = ?;', [id]);
  if (!employee) throw new Response('Employee not found', { status: 404 });

  return { employee };
};

export const action: ActionFunction = async ({ request, params }) => {
  const id = params.employeeId!;
  const formData = await request.formData();

  const db = await getDB();
  await db.run(
    `UPDATE employees SET
      full_name    = ?,
      email        = ?,
      phone_number = ?,
      date_of_birth= ?,
      job_title    = ?,
      department   = ?,
      salary       = ?,
      start_date   = ?,
      end_date     = ?
     WHERE id = ?;`,
    [
      formData.get('full_name'),
      formData.get('email'),
      formData.get('phone_number'),
      formData.get('date_of_birth'),
      formData.get('job_title'),
      formData.get('department'),
      formData.get('salary'),
      formData.get('start_date'),
      formData.get('end_date') || null,
      id,
    ]
  );

  return redirect('/employees');
};

export default function EditEmployeePage() {
  const { employee } = useLoaderData();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          Edit Employee #{employee.id}
        </h1>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
          <EmployeeForm
            defaultValues={{
              full_name: employee.full_name,
              email: employee.email,
              phone_number: employee.phone_number,
              date_of_birth: employee.date_of_birth,
              job_title: employee.job_title,
              department: employee.department,
              salary: employee.salary,
              start_date: employee.start_date,
              end_date: employee.end_date,
            }}
            submitLabel="Save Changes"
          />
        </div>

        <hr className="my-4 border-gray-300 dark:border-gray-700" />

        <div className="flex gap-2 w-full max-w-md mx-auto mb-2">
          <a
            href="/employees"
            className="flex-1 text-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
          >
            Employees
          </a>
          <a
            href="/employees/new"
            className="flex-1 text-center px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition"
          >
            New Employee
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
