import {
  addDays,
  endOfMonth,
  getDaysInMonth,
  startOfMonth,
  subDays,
} from "date-fns";

/**
 * 取得日曆陣列，補足前一週與當月完整，並補齊最後一週
 * @param {Date} targetDate
 * @returns {Date[]}
 */
export default function getCalendarGrid(targetDate) {
  const days = [];

  const firstOfMonth = startOfMonth(targetDate);
  const lastOfMonth = endOfMonth(targetDate);
  const daysInMonth = getDaysInMonth(targetDate);
  const startDayOfWeek = firstOfMonth.getDay(); // 0=週日
  const endDayOfWeek = lastOfMonth.getDay(); // 0=週日 ~ 6=週六

  // 補前幾天
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push(subDays(firstOfMonth, i + 1));
  }

  // 當月日期
  for (let i = 0; i < daysInMonth; i++) {
    days.push(addDays(firstOfMonth, i));
  }

  // 補下個月直到週六
  const remaining = 6 - endDayOfWeek;
  const nextMonthStart = addDays(lastOfMonth, 1);
  for (let i = 0; i < remaining; i++) {
    days.push(addDays(nextMonthStart, i));
  }

  return days;
}
