import { doc, getDoc, updateDoc } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";




export const updateEntrustStatus = async (orderId) => {
    try {
        const orderRef = adminDb.doc(`artworkOrders/${orderId}`);
        const orderSnap = await orderRef.get();

        if (!orderSnap.exists) {
     
            return;
        }

        const orderData = orderSnap.data();
        const entrustId = orderData.fromEntrustId;
        const entrustUserUid = orderData.userUid;

        if (!entrustId || !entrustUserUid) {
            console.warn(`缺少 entrustId 或 userUid`);
            return;
          }

        // 更新對應的委託 isActive 為 false
        const entrustRef = adminDb.doc(`entrustMarket/${entrustUserUid}/entrusts/${entrustId}`);
        await entrustRef.update({ isActive: false });

    } catch (error) {
      console.error("更新委託 isActive 失敗:", error.message);
    }
  };