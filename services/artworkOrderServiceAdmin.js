// lib/server/artworkOrderServiceAdmin.js
import { doc, getDoc, updateDoc } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";



export const updateEntrustOrderAfterPaymentAdmin = async (orderId) => {
  try {
    const orderRef = adminDb.doc(`artworkOrders/${orderId}`);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
     
      return;
    }

    const orderData = orderSnap.data();
    const updatedMilestones = [...orderData.artworkOrderMilestones];
    const index = updatedMilestones.findIndex((m) => m.id === 0);

    if (index === -1) {
      console.warn("找不到 id 為 0 的 milestone");
      return;
    }

    updatedMilestones[index].status = "已付款";

    let endDate = null;
    if (orderData.pendingPainterExpectedDays) {
    const today = new Date();
    today.setDate(today.getDate() + orderData.pendingPainterExpectedDays);
    endDate = today.toISOString().split("T")[0]; // 只保留日期部分，如 2025-05-21
    }

    await orderRef.update({
      artworkOrderMilestones: updatedMilestones,
      assignedPainterUid: orderData.pendingPainterArtistUid,
      price: orderData.pendingPainterExpectedPrice,
      endDate:endDate,
      status: "進行中",
    });

    console.log("artworkOrderMilestones 已成功更新為已付款");
  } catch (err) {
    console.error(" 使用 admin SDK 更新付款狀態失敗：", err);
  }
};

export const pendingPainterTempData = async (orderId, artistUid, expectedDays, expectedPrice) => {
    try {   
      const orderRef = adminDb.doc(`artworkOrders/${orderId}`);
      const orderSnap = await orderRef.get();
  
      if (!orderSnap.exists) {
        console.warn(` 找不到訂單：${orderId}`);
        return { success: false, message: "找不到訂單" };
      }
  
      await orderRef.update({
        pendingPainterArtistUid: artistUid,
        pendingPainterExpectedDays: expectedDays,
        pendingPainterExpectedPrice: expectedPrice,
        paymentInitiatedAt: new Date().toISOString(),
      });
  
      console.log(`已暫存繪師資料到訂單 ${orderId}`);
      return { success: true, message: "暫存成功" };
    } catch (err) {
      console.error(" 暫存繪師資料失敗：", err);
      return { success: false, message: err.message };
    }
  };



  export const updateMarkettOrderAfterPaymentAdmin = async (orderId) => {
    try {
      const orderRef = adminDb.doc(`artworkOrders/${orderId}`);
      const orderSnap = await orderRef.get();
  
      if (!orderSnap.exists) {
       
        return;
      }
  
      const orderData = orderSnap.data();
      const updatedMilestones = [...orderData.artworkOrderMilestones];
      const index = updatedMilestones.findIndex((m) => m.id === 0);
  
      if (index === -1) {
        console.warn("找不到 id 為 0 的 milestone");
        return;
      }
  
      updatedMilestones[index].status = "已付款";
  
      let endDate = null;
      if (orderData.pendingPainterExpectedDays) {
      const today = new Date();
      today.setDate(today.getDate() + orderData.pendingPainterExpectedDays);
      endDate = today.toISOString().split("T")[0]; // 只保留日期部分，如 2025-05-21
      }
  
      await orderRef.update({
        artworkOrderMilestones: updatedMilestones,
        isVisibleToConsumer: true,
        status: "進行中",
      });
  
      console.log("artworkOrderMilestones 已成功更新為已付款");
    } catch (err) {
      console.error(" 使用 admin SDK 更新付款狀態失敗：", err);
    }
  };