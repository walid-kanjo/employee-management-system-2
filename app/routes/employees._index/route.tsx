import { useLoaderData } from 'react-router';
import { useState } from 'react';
import { getDB } from '~/db/getDB';

export async function loader() {
  const db = await getDB();
  const employees = await db.all('SELECT * FROM employees;');
  return { employees };
}

export default function EmployeesPage() {
  const { employees } = useLoaderData();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sortField, setSortField] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredEmployees = employees
    .filter((e: any) =>
      `${e.full_name} ${e.email} ${e.job_title} ${e.phone_number}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((e: any) =>
      departmentFilter ? e.department === departmentFilter : true
    )
    .sort((a: any, b: any) => {
      if (!sortField) return 0;
      return a[sortField].localeCompare(b[sortField]);
    });

  const departments = [...new Set(employees.map((e: any) => e.department))];
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Employees</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <label className="flex items-center gap-2">
          <span>Filter</span>
          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
          >
            <option value="">All Departments</option>
            {departments.map((dept: any) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span>Sort by</span>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
          >
            <option value="">None</option>
            <option value="full_name">Full Name</option>
            <option value="email">Email</option>
            <option value="job_title">Job Title</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-700 text-left">
            <tr>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Job Title</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((employee: any) => (
              <tr
                key={employee.id}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="px-4 py-2">{employee.full_name}</td>
                <td className="px-4 py-2">{employee.email}</td>
                <td className="px-4 py-2">{employee.phone_number}</td>
                <td className="px-4 py-2">{employee.job_title}</td>
                <td className="px-4 py-2">{employee.department}</td>
                <td className="px-4 py-2">
                  <a
                    href={`/employees/${employee.id}`}
                    className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded bg-white dark:bg-gray-800 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded bg-white dark:bg-gray-800 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Actions */}
      <div className="flex mt-8 space-x-4">
        <a
          href="/employees/new"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          New Employee
        </a>
        <a
          href="/timesheets/"
          className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Timesheets
        </a>
      </div>
    </div>
  );
}
