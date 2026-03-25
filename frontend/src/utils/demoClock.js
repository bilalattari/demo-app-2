import dayjs from 'dayjs';

// Use a fixed "now" so the demo stays consistent regardless of the current calendar date.
// (Mock data in `mockData.js` is mainly in 2025.)
export const DEMO_NOW = dayjs('2025-06-02');

export function daysOverdue(dueDate) {
  if (!dueDate) return 0;
  const due = dayjs(dueDate);
  const diff = DEMO_NOW.startOf('day').diff(due.startOf('day'), 'day');
  return diff > 0 ? diff : 0;
}

export function isOverdue(dueDate) {
  return daysOverdue(dueDate) > 0;
}

