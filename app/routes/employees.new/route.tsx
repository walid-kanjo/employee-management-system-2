import { redirect, type ActionFunction } from 'react-router';
import { getDB } from '~/db/getDB';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import EmployeeForm from '~/components/EmployeeForm';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const full_name = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const phone_number = formData.get('phone_number') as string;
  const date_of_birth = formData.get('date_of_birth') as string;
  const job_title = formData.get('job_title') as string;
  const department = formData.get('department') as string;
  const salary = parseFloat(formData.get('salary') as string);
  const start_date = formData.get('start_date') as string;
  const end_date = (formData.get('end_date') as string) || null;

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const photoFile = formData.get('photo') as File | null;
  let photoPath: string | null = null;
  if (photoFile && photoFile.size > 0) {
    const ext = path.extname(photoFile.name);
    const filename = `${uuid()}${ext}`;
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    try {
      await fs.writeFile(path.join(uploadsDir, filename), buffer);
      photoPath = `/uploads/${filename}`;
    } catch (error) {
      console.log('error: ', error);
    }
  }

  const docsFiles = formData.getAll('documents') as File[];
  const docPaths: { originalName: string; storedPath: string }[] = [];
  for (const doc of docsFiles) {
    if (doc && doc.size > 0) {
      const ext = path.extname(doc.name);
      const filename = `${uuid()}${ext}`;
      const buffer = Buffer.from(await doc.arrayBuffer());
      const storedPath = `/uploads/${filename}`;
      await fs.writeFile(path.join(uploadsDir, filename), buffer);
      docPaths.push({
        originalName: doc.name,
        storedPath,
      });
    }
  }

  // Insert into DB
  const db = await getDB();
  await db.run(
    `INSERT INTO employees
       ( full_name, email, phone_number, date_of_birth,
         job_title, department, salary, start_date, end_date,
         photo_path, documents_path )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      photoPath,
      JSON.stringify(docPaths),
    ]
  );

  return redirect('/employees');
};

export default function NewEmployeePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          Create New Employee
        </h1>
        <div className="bg-white dark:bg-gray-800  rounded shadow-md">
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
