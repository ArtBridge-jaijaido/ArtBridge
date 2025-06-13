// services/firebase/availabilityService.ts
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import { defaultStatus } from "@/components/ScheduleAvailabilityPanel/constants";

const COLLECTION_NAME = "userAvailability";

// 工具函式：處理 updatedAt 欄位
function serializeAvailability(doc) {
  return {
    ...doc,
    updatedAt: doc.updatedAt?.toDate().toISOString() ?? null, // 或 .toMillis()
  };
}

/**
 * 初始化使用者從指定月份起六個月內缺失的可用狀態資料。
 * 僅建立不存在的紀錄，資料內容為預設狀態。
 *
 * @param {string} userUid - 使用者 UID
 * @param {number} year - 起始年
 * @param {number} startMonth - 起始月（1~12）
 * @returns {Promise<void>}
 */
export async function initAvailabilityIfMissing(userUid, year, startMonth) {
  const months = Array.from(
    { length: 6 },
    (_, i) => ((startMonth + i - 1) % 12) + 1
  );

  const q = query(
    collection(db, COLLECTION_NAME),
    where("userUid", "==", userUid),
    where("year", "==", year),
    where("month", "in", months)
  );

  const snapshot = await getDocs(q);
  const foundMonths = snapshot.docs.map((doc) => doc.data().month);
  const missingMonths = months.filter((m) => !foundMonths.includes(m));

  if (missingMonths.length > 0) {
    const batch = writeBatch(db);
    missingMonths.forEach((month) => {
      const docData = {
        userUid,
        year,
        month,
        firstHalf: defaultStatus,
        secondHalf: defaultStatus,
        updatedAt: Timestamp.now(),
      };
      const docRef = doc(db, COLLECTION_NAME, `${userUid}_${year}_${month}`);
      batch.set(docRef, docData);
    });
    await batch.commit();
  }
}

/**
 * 取得使用者從指定月份起的六個月可用狀態資料。
 * 若資料缺漏，將以 defaultStatus 補上。
 *
 * @param {string} userUid - 使用者 UID
 * @param {number} year - 起始年
 * @param {number} startMonth - 起始月（1~12）
 * @returns {Promise<Array<Object>>} 六筆可用狀態資料，含原始或補上資料
 */
export async function fetchAvailability(userUid, year, startMonth) {
  try {
    const months = Array.from(
      { length: 6 },
      (_, i) => ((startMonth + i - 1) % 12) + 1
    );
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userUid", "==", userUid),
      where("year", "==", year),
      where("month", "in", months)
    );

    const snapshot = await getDocs(q);
    const records = snapshot.docs.map((doc) =>
      serializeAvailability(doc.data())
    );

    const results = months.map((month) => {
      const existing = records.find((record) => record.month === month);
      if (existing) return existing;

      const targetYear = month >= startMonth ? year : year + 1;
      return {
        userUid,
        year: targetYear,
        month,
        firstHalf: defaultStatus,
        secondHalf: defaultStatus,
        updatedAt: null,
      };
    });

    return results.sort((a, b) => a.month - b.month);
  } catch (error) {
    console.error("[fetchAvailability] 發生錯誤：", error);
    throw error;
  }
}

/**
 * 更新特定使用者在指定年月的可用狀態資料。
 * 如果該筆資料尚未存在，會自動建立。
 *
 * @param {Object} data - 可用時間資料物件
 * @param {string} data.userUid - 使用者 UID
 * @param {number} data.year - 年份（例如 2025）
 * @param {number} data.month - 月份（1~12）
 * @param {string} data.firstHalf - 上半月的可用狀態（如 'available'、'busy'、'unknown'）
 * @param {string} data.secondHalf - 下半月的可用狀態
 * @returns {Promise<Object>} 回傳寫入成功的資料（含時間戳）
 */
export async function updateAvailability(data) {
  const docId = `${data.userUid}_${data.year}_${data.month}`;
  const docRef = doc(db, COLLECTION_NAME, docId);

  await setDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(), // 自動更新時間戳記
  });

  return data;
}
