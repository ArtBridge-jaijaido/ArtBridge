import { db, storage } from "@/lib/firebase";
import {
  doc,
  setDoc,
  runTransaction
} from "firebase/firestore";



// ✅ 建立訂單
export const createOrderFromEntrust = async (entrustData) => {
  try {
    const artworkOrderId = await generateOrderSerial();

    const copyRes = await fetch("/api/copyEntrustImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: entrustData.userId,
          entrustId: entrustData.entrustId,
          orderId: artworkOrderId,
          supplementaryImageUrls: entrustData.supplementaryImageUrls || [], 
        }),
      });

      const copyData = await copyRes.json();

      if (!copyRes.ok || !copyData?.copiedExampleImageUrl) {
        throw new Error(copyData?.error || "圖片複製失敗");
      }

      const copiedExampleImageUrl = copyData.copiedExampleImageUrl;
      const copiedSupplementaryImageUrls = copyData.copiedSupplementaryImageUrls || [];

      
  

    // 訂單資料
    const artworkOrder = {
      artworkOrderId,
      type: "fromEntrust",
      fromEntrustId: entrustData.entrustId,
      userUid: entrustData.userUid,
      userId: entrustData.userId,
      marketName: entrustData.marketName,
      exampleImageUrl: copiedExampleImageUrl,
      supplementaryImageUrls:copiedSupplementaryImageUrls,
      description: entrustData.description,
      category: entrustData.selectedCategory,
      styles: entrustData.selectedStyles,
      size: entrustData.size,
      fileFormat: entrustData.fileFormat,
      colorMode: entrustData.colorMode,
      permission: entrustData.permission,
      reportProgress: entrustData.reportProgress,
      createdAt: new Date().toISOString(),
      status: "等待承接",
      orderSource: "尚無資訊",
      endDate: "尚無資訊",
      price: entrustData.price,
      assignedPainterUid: null,
      applicants: [],
      artworkOrderMilestones: entrustData.milestones,
      currentMilestoneIndex: 0,
    };

    //  存入 Firestore
    const orderRef = doc(db, "artworkOrders", artworkOrderId);
    await setDoc(orderRef, artworkOrder);

    return { success: true, message: "委託訂單已建立", orderData: artworkOrder };
  } catch (err) {
    console.error("❌ 建立訂單失敗:", err);
    return { success: false, message: err.message };
  }
};



// 訂單編號生成器
export const generateOrderSerial = async () => {
  const trackerRef = doc(db, "serialTracker", "orderSerial");

  return await runTransaction(db, async (transaction) => {
    const trackerSnap = await transaction.get(trackerRef);

    let latestSerial = 0;
    if (trackerSnap.exists()) {
      latestSerial = trackerSnap.data().latestSerial;
    }

    const newSerial = latestSerial + 1;

    if (newSerial > 99999999) {
      throw new Error("已達案件編號上限！");
    }

    transaction.set(trackerRef, { latestSerial: newSerial });

    return String(newSerial).padStart(8, "0"); // e.g. 00000001
  });
};
