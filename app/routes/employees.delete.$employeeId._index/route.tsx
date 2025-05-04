import { redirect, type ActionFunction } from 'react-router';
import { getDB } from '~/db/getDB';
import fs from 'fs/promises';
import path from 'path';

export const action: ActionFunction = async ({ params }) => {
  const id = params.employeeId;
  if (!id) {
    throw new Response('Employee ID missing', { status: 400 });
  }

  // Load the employee row to get file paths
  const db = await getDB();
  const row = await db.get<{
    photo_path: string | null;
    documents_path: string | null;
  }>('SELECT photo_path, documents_path FROM employees WHERE id = ?;', [id]);

  if (!row) {
    throw new Response('Not found', { status: 404 });
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  //  Delete photo if present
  if (row.photo_path) {
    const rel = row.photo_path.replace(/^\//, '');
    await fs.unlink(path.join(process.cwd(), 'public', rel)).catch(() => {});
  }

  //  Delete each document file
  const docs: { storedPath: string }[] = JSON.parse(row.documents_path || '[]');
  for (const { storedPath } of docs) {
    const rel = storedPath.replace(/^\//, '');
    await fs.unlink(path.join(process.cwd(), 'public', rel)).catch(() => {});
  }

  // Delete the employee record
  await db.run('DELETE FROM employees WHERE id = ?;', [id]);

  return redirect('/employees');
};

export default function DeleteEmployeePage() {
  return null;
}
