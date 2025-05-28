const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.deleteOldNotifications = onSchedule(
  {
    schedule: "0 2 * * *",       // 每天凌晨 2 點（台北時間）
    timeZone: "Asia/Taipei",     // 台北時區
  },
  async (event) => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 天前
    const cutoffISO = cutoff.toISOString();

    const snapshot = await db
      .collection("artworkNotifications")
      .where("isRead", "==", true)
      .where("createdAt", "<", cutoffISO)
      .get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
      console.log("沒有符合條件的通知可刪除");
      return null;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`已刪除 ${batchSize} 筆「已讀超過 30 天」的通知`);
    return null;
  }
);
