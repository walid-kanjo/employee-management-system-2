import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const { sqlite_path: sqlitePath } = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const employees = [
  {
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    phone_number: '123-456-7890',
    date_of_birth: '1985-06-15',
    job_title: 'Software Engineer',
    department: 'Engineering',
    salary: 80000,
    start_date: '2021-01-15',
    photo_path: 'photos/john_doe.jpg',
    documents_path: 'documents/john_doe_resume.pdf',
  },
  {
    full_name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone_number: '234-567-8901',
    date_of_birth: '1990-04-22',
    job_title: 'Project Manager',
    department: 'Operations',
    salary: 95000,
    start_date: '2020-03-01',
    photo_path: 'photos/jane_smith.jpg',
    documents_path: 'documents/jane_smith_resume.pdf',
  },
  {
    full_name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone_number: '345-678-9012',
    date_of_birth: '1982-11-10',
    job_title: 'HR Specialist',
    department: 'Human Resources',
    salary: 65000,
    start_date: '2019-09-05',
    photo_path: 'photos/alice_johnson.jpg',
    documents_path: 'documents/alice_johnson_resume.pdf',
  },
];

const timesheets = [
  {
    employee_id: 1,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    summary: 'Developed new feature for product A',
  },
  {
    employee_id: 2,
    start_time: '2025-02-11 12:00:00',
    end_time: '2025-02-11 17:00:00',
    summary: 'Project planning and client meeting',
  },
  {
    employee_id: 3,
    start_time: '2025-02-12 07:00:00',
    end_time: '2025-02-12 16:00:00',
    summary: 'Processed employee benefits requests',
  },
];

const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0])
    .map(() => '?')
    .join(', ');

  const insertStmt = db.prepare(
    `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
  );

  data.forEach((row) => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData('employees', employees);
  insertData('timesheets', timesheets);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});
