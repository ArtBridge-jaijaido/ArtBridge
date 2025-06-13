import { format } from "date-fns";

import { COLORS } from "./constants";

/**
 * 將 consumerOrders 轉換成 calendar event 格式
 *
 * @param {Array} orders - consumerOrders 資料，需包含 startDate、endDate、title 欄位
 * @param {Date} currentMonthDate - 用來決定顏色順序從當月起始第一筆排
 * @returns {Array<{
 *   title: string,         // 案件名稱
 *   color: string,         // 顯示在日曆或列表上的顏色圓點
 *   dateRange: string      // 顯示用的期間，例如 "01/01~01/14"
 * }>}
 */
export function convertOrdersToCaseFormat(orders, currentMonthDate) {
  const month = currentMonthDate.getMonth() + 1; // 1~12
  const year = currentMonthDate.getFullYear();

  const filtered = orders.filter((order) => {
    const start = new Date(order.startDate);
    return start.getFullYear() === year && start.getMonth() + 1 === month;
  });

  const sorted = filtered.sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  return sorted.map((order, index) => {
    const color = COLORS[index % COLORS.length];
    const start = new Date(order.startDate);
    const end = new Date(order.endDate);
    const dateRange = `${format(start, "MM/dd")}~${format(end, "MM/dd")}`;

    return {
      title: order.marketName,
      color,
      dateRange,
    };
  });
}
