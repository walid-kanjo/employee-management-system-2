import {
  redirect,
  type LoaderFunction,
  type ActionFunction,
  useLoaderData,
  useParams,
} from 'react-router';
import { getDB } from '~/db/getDB';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import EmployeeForm from '~/components/EmployeeForm';

interface LoaderData {
  employee: {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
    job_title: string;
    department: string;
    salary: number;
    start_date: string;
    end_date: string | null;
    photo_path: string | null;
    documents: { originalName: string; storedPath: string }[];
  };
}

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.employeeId;
  if (!id) throw new Response('Not Found', { status: 404 });

  const db = await getDB();
  const row = await db.get<any>('SELECT * FROM employees WHERE id = ?;', [id]);
  if (!row) throw new Response('Employee not found', { status: 404 });

  const documents: { originalName: string; storedPath: string }[] = JSON.parse(
    row.documents_path || '[]'
  );

  return {
    employee: {
      id: row.id,
      full_name: row.full_name,
      email: row.email,
      phone_number: row.phone_number,
      date_of_birth: row.date_of_birth,
      job_title: row.job_title,
      department: row.department,
      salary: row.salary,
      start_date: row.start_date,
      end_date: row.end_date,
      photo_path: row.photo_path,
      documents,
    },
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const id = params.employeeId!;
  const formData = await request.formData();

  const originalPhoto = (formData.get('original_photo') as string) || '';
  const originalDocs = JSON.parse(
    formData.get('original_documents') as string
  ) as { originalName: string; storedPath: string }[];

  const keptPhoto = (formData.get('existing_photo') as string) || '';
  const keptDocs = formData.getAll('existing_documents') as string[];

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  // Photo cleanup
  if (originalPhoto && originalPhoto !== keptPhoto) {
    // guard against empty/undefined
    const relPath = originalPhoto.replace(/^\//, '');
    if (relPath) {
      await fs
        .unlink(path.join(process.cwd(), 'public', relPath))
        .catch(() => {});
    }
  }

  //  Documents cleanup
  // Build array of paths to remove
  const docsRemoved = originalDocs
    .map((d) => d.storedPath)
    .filter((p): p is string => Boolean(p) && !keptDocs.includes(p));

  for (const storedPath of docsRemoved) {
    const relPath = storedPath.replace(/^\//, '');
    if (relPath) {
      await fs
        .unlink(path.join(process.cwd(), 'public', relPath))
        .catch(() => {});
    }
  }

  //  text fields
  const full_name = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const phone_number = formData.get('phone_number') as string;
  const date_of_birth = formData.get('date_of_birth') as string;
  const job_title = formData.get('job_title') as string;
  const department = formData.get('department') as string;
  const salary = parseFloat(formData.get('salary') as string);
  const start_date = formData.get('start_date') as string;
  const end_date = (formData.get('end_date') as string) || null;

  // Photo handling
  const photoFile = formData.get('photo') as File | null;
  let finalPhotoPath: string | null = keptPhoto || null;
  if ((!keptPhoto || keptPhoto === '') && photoFile && photoFile.size > 0) {
    const ext = path.extname(photoFile.name);
    const filename = `${uuid()}${ext}`;
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    await fs.writeFile(path.join(uploadsDir, filename), buffer);
    finalPhotoPath = `/uploads/${filename}`;
  }

  // Documents handling
  const newDocs = formData.getAll('documents') as File[];
  // Start with kept originals as objects
  const finalDocs: { originalName: string; storedPath: string }[] =
    originalDocs.filter((d) => keptDocs.includes(d.storedPath));

  for (const doc of newDocs) {
    if (doc.size > 0) {
      const ext = path.extname(doc.name);
      const filename = `${uuid()}${ext}`;
      const buffer = Buffer.from(await doc.arrayBuffer());
      const storedPath = `/uploads/${filename}`;
      await fs.writeFile(path.join(uploadsDir, filename), buffer);
      finalDocs.push({ originalName: doc.name, storedPath });
    }
  }

  // save to DB
  const db = await getDB();
  await db.run(
    `UPDATE employees SET
       full_name      = ?,
       email          = ?,
       phone_number   = ?,
       date_of_birth  = ?,
       job_title      = ?,
       department     = ?,
       salary         = ?,
       start_date     = ?,
       end_date       = ?,
       photo_path     = ?,
       documents_path = ?
     WHERE id = ?;`,
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
      finalPhotoPath,
      JSON.stringify(finalDocs),
      id,
    ]
  );

  return redirect('/employees');
};

export default function EditEmployeePage() {
  const { employee } = useLoaderData<LoaderData>();
  const params = useParams();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          Edit Employee #{params.employeeId}
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded shadow-md">
          <EmployeeForm
            submitLabel="Save Changes"
            defaultValues={{
              full_name: employee.full_name,
              email: employee.email,
              phone_number: employee.phone_number,
              date_of_birth: employee.date_of_birth,
              job_title: employee.job_title,
              department: employee.department,
              salary: employee.salary,
              start_date: employee.start_date,
              end_date: employee.end_date ?? undefined,
              photo: employee.photo_path,
              documents: employee.documents,
            }}
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
