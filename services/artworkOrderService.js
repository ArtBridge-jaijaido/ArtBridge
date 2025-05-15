import { db, storage } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  runTransaction,
  updateDoc,
  arrayUnion,
  increment,

} from "firebase/firestore";
import { uploadPainterResumePdf  } from "@/services/storageService.js";
import { ref, listAll, deleteObject } from "firebase/storage";

// 建立訂單
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


// 更新訂單
export const updateArtworkOrder = async (orderId, updateData) => {
    const orderRef = doc(db, "artworkOrders", orderId);
    await updateDoc(orderRef, updateData);
};


// 刪除訂單
export const deleteArtworkOrderFromService = async (orderId) => {
    try {
      // 刪除 Firestore 文件
      const orderRef = doc(db, "artworkOrders", orderId);
      await deleteDoc(orderRef);
  
      // 刪除 Storage 圖片（exampleImage 與 supplementaryImages）
      const basePath = `artworkOrders/${orderId}`;
      const folderRef = ref(storage, basePath);
  
      const listResult = await listAll(folderRef);
      const deletePromises = listResult.items.map((itemRef) => deleteObject(itemRef));
      await Promise.all(deletePromises);
  
      console.log(" 已刪除訂單與相關圖片");
      return { success: true, message: "訂單刪除成功" };
    } catch (error) {
      console.error("刪除訂單失敗:", error);
      return { success: false, message: error.message };
    }
  };



// 透過orderId 檢視繪師是否應徵過該訂單
export const checkIfPainterApplied = async (orderId, painterUid) => {
    try {
      const orderRef = doc(db, "artworkOrders", orderId);
      const orderSnap = await getDoc(orderRef);
  
      if (!orderSnap.exists()) {
        throw new Error("找不到該訂單");
      }
  
      const orderData = orderSnap.data();
      const applicants = orderData.applicants || [];
  
      return applicants.some(applicant => applicant.painterUid === painterUid);
    } catch (error) {
      console.error("檢查繪師是否應徵過失敗:", error);
      throw error;
    }
  };


// handle painter apply Entrust 
export const handlePainterApplyEntrust = async ({
    file,              // PDF 履歷
    user,              // 當前使用者（firebase auth user）
    expectedDays,
    expectedPrice,
    orderId,
    entrustId,
    entrustUserUid,    // 委託方 userUid
  }) => {
    //  上傳履歷 PDF
    const resumeUrl = await uploadPainterResumePdf(file, orderId, user.uid);
  
    //  準備應徵資料
    const applicantData = {
      painterUid: user.uid,
      expectedDays: parseInt(expectedDays),
      expectedPrice: parseInt(expectedPrice),
      resumePdfUrl: resumeUrl,
      appliedAt: new Date().toISOString(),
    };
  
    //  將資料寫入訂單的 applicants
    const orderRef = doc(db, "artworkOrders", orderId);
    await updateDoc(orderRef, {
      applicants: arrayUnion(applicantData),
    });
  
    // 更新委託的 applicantsCount
    const entrustRef = doc(db, "entrustMarket", entrustUserUid, "entrusts", entrustId);
    await updateDoc(entrustRef, {
      applicationCount: increment(1),
    });
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
