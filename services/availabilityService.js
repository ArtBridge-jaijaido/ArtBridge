// services/firebase/availabilityService.ts
import {
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "user_availability";

// 取得某使用者的整年紀錄
export async function fetchAvailability(userUid, year, startMonth) {
  const months = Array.from({ length: 6 }, (_, i) => startMonth + i).filter(
    (m) => m <= 12
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

  // 若有缺少月份 → 初始化補上
  if (missingMonths.length > 0) {
    const batch = writeBatch(db);
    const newDocs = missingMonths.map((month) => {
      const docData = {
        userUid,
        year,
        month,
        firstHalf: "none",
        secondHalf: "none",
        updatedAt: Timestamp.now(),
      };
      const docRef = doc(db, COLLECTION_NAME, `${userUid}_${year}_${month}`);
      batch.set(docRef, docData);
      return docData;
    });
    await batch.commit();
    return [...snapshot.docs.map((doc) => doc.data()), ...newDocs];
  }

  return snapshot.docs.map((doc) => doc.data());
}

export async function updateAvailability(data) {
  const docId = `${data.userId}_${data.year}_${data.month}`;
  const docRef = doc(db, COLLECTION_NAME, docId);

  await setDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(), // 自動更新時間戳記
  });

  return data;
}
