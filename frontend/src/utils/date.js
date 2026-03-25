import dayjs from 'dayjs';

export function formatISODate(dateLike) {
  if (!dateLike) return '';
  return dayjs(dateLike).format('YYYY-MM-DD');
}

export function daysBetweenDueAndNow(dueDate, now = dayjs()) {
  if (!dueDate) return 0;
  const due = dayjs(dueDate);
  return due.startOf('day').diff(now.startOf('day'), 'day') * -1; // positive => overdue
}

export function isOverdue(dueDate, now = dayjs()) {
  return daysBetweenDueAndNow(dueDate, now) > 0;
}

