import { useLoaderData } from 'react-router';
import { useState, useMemo, useEffect } from 'react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import '@schedule-x/theme-default/dist/index.css';
import { getDB } from '~/db/getDB';

// Loader function
export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    `SELECT
       timesheets.*,
       employees.full_name
     FROM timesheets
     JOIN employees ON timesheets.employee_id = employees.id
     ORDER BY timesheets.start_time DESC`
  );
  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData<typeof loader>();
  const [isCalendarView, setIsCalendarView] = useState(false);

  // Prepare events
  const events = useMemo(
    () =>
      timesheetsAndEmployees.map((ts: any) => ({
        id: String(ts.id),
        title: `${ts.full_name}: ${ts.summary}`,
        start: ts.start_time.replace('T', ' ').slice(0, 16),
        end: ts.end_time.replace('T', ' ').slice(0, 16),
      })),
    [timesheetsAndEmployees]
  );

  // Calendar setup
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events,
    plugins: [eventsService],
  });
  // calendar?.setTheme('dark');
  // Set calendar theme based on system preference
  useEffect(() => {
    if (!calendar) return;

    // Set initial theme
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    calendar.setTheme(isDark ? 'dark' : 'light');

    // Handle theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      calendar.setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [calendar]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center">Timesheets</h1>

        <div className="flex items-center justify-between mb-6 w-full max-w-7xl mx-auto">
          <div className="flex  space-x-4">
            <button
              onClick={() => setIsCalendarView(false)}
              className={`px-4 py-2 rounded ${
                !isCalendarView
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setIsCalendarView(true)}
              className={`px-4 py-2 rounded ${
                isCalendarView
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
              }`}
            >
              Calendar View
            </button>
          </div>
          <div className="flex  space-x-4">
            <a
              href="/timesheets/new"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
            >
              New Timesheet
            </a>
            <a
              href="/employees"
              className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition"
            >
              Employees
            </a>
          </div>
        </div>

        {/* Content */}
        {isCalendarView ? (
          <div className="flex-1 flex flex-col overflow-hidden rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="sx-react-calendar-wrapper bg-inherit">
              <ScheduleXCalendar calendarApp={calendar} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-auto">
            {timesheetsAndEmployees.map((ts: any) => (
              <div
                key={ts.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
              >
                <h2 className="font-semibold text-lg mb-2">
                  Timesheet #{ts.id}
                </h2>
                <p className="text-sm">
                  <span className="font-bold">Employee:</span> {ts.full_name}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Start:</span>{' '}
                  {ts.start_time.replace('T', ' ')}
                </p>
                <p className="text-sm">
                  <span className="font-bold">End:</span>{' '}
                  {ts.end_time.replace('T', ' ')}
                </p>
                <p className="mt-2 text-sm font-bold">Summary: {ts.summary}</p>
                <div className="mt-4 text-right">
                  <a
                    href={`/timesheets/${ts.id}`}
                    className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
                  >
                    Edit
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
