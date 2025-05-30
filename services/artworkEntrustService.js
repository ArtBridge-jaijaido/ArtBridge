import { db, storage } from "@/lib/firebase";
import { ref, listAll, deleteObject } from "firebase/storage";
import {
  collectionGroup,
  collection,
  updateDoc,
  getDoc,
  setDoc,
  getDocs,
  where,
  deleteDoc,
  query,
  orderBy,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { uploadImage } from "./storageService";

/**
 * 上傳委託到 Firestore 與 Storage
 */
export const uploadEntrust = async (userUid, userSerialId, formData) => {
  try {
    const entrustId = userSerialId + "_" + Date.now().toString();

    // 上傳範例圖片
    let exampleImageUrl = "";
    if (formData.exampleImage?.file) {
      exampleImageUrl = await uploadImage(
        formData.exampleImage.file,
        `entrustMarket/${userSerialId}/${entrustId}/exampleImage.jpg`
      );
    }

    // 上傳補充圖片
    const supplementaryImages = formData.supplementaryImages || [];

    const supplementaryImageUrls = await Promise.all(
      supplementaryImages.map((img, index) =>
        uploadImage(
          img.file,
          `entrustMarket/${userSerialId}/${entrustId}/supplementaryImage_${index + 1}.jpg`
        )
      )
    );

    // 過濾掉不需要儲存的檔案物件
    const { exampleImage, supplementaryImages: _, ...filteredFormData } = formData;

    const entrustData = {
      ...filteredFormData,
      userId: userSerialId,
      userUid: userUid,
      entrustId: entrustId,
      exampleImageUrl,
      supplementaryImageUrls,
      applicationCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const entrustRef = doc(db, "entrustMarket", userUid, "entrusts", entrustId);
    await setDoc(entrustRef, entrustData);
    return { success: true, message: "委託上傳成功", entrustData };

  } catch (error) {
    console.error("委託上傳失敗:", error);
    return { success: false, message: error.message };
  }
};


/**
 * link id between entrust and order
 */
export const updateEntrustLinkedOrderId = async (userUid, entrustId, orderId) => {
  try {
    const entrustRef = doc(db, "entrustMarket", userUid, "entrusts", entrustId);
    await updateDoc(entrustRef, {
      linkedArtworkOrderId: orderId,
    });
    return { success: true, message: "已成功寫入 linkedArtworkOrderId" };
  } catch (error) {
    console.error("更新 linkedArtworkOrderId 失敗:", error);
    return { success: false, message: error.message };
  }
};


/**
 * 獲取指定使用者的委託
 */
export const fetchUserEntrusts = async (userUid) => {
  try {
    const q = query(
      collection(db, "entrustMarket", userUid, "entrusts"),
      orderBy("createdAt", "asc")
    );

    const querySnapshot = await getDocs(q);
    const entrusts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return entrusts;
  } catch (error) {
    console.error("獲取委託失敗:", error);
    return [];
  }
};



/**
 * 刪除指定使用者的委託
 */

export const deleteUserEntrust = async (userUid, userSerialId, entrustId) => {
  try {

    const entrustRef = doc(db, "entrustMarket", userUid, "entrusts", entrustId);
    await deleteDoc(entrustRef);

    // 構建圖片路徑
    const basePath = `entrustMarket/${userSerialId}/${entrustId}`;

    console.log("刪除圖片路徑:", basePath);

    // 刪除範例圖片
    const exampleImageRef = ref(storage, `${basePath}/exampleImage.jpg`);
    await deleteObject(exampleImageRef);

    // 依序刪除補充圖片（最多 5 張）
    for (let i = 1; i <= 5; i++) {
      const suppRef = ref(storage, `${basePath}/supplementaryImage_${i}.jpg`);
      try {
        await deleteObject(suppRef);
      } catch (err) {
        if (err.code !== "storage/object-not-found") {
          console.warn(`補充圖片 #${i} 刪除失敗:`, err);
        }
      }
    }

    return { success: true, message: "委託刪除成功" };
  } catch (error) {
    console.error(" 委託刪除失敗:", error);
    return { success: false, message: error.message };
  }
};


/**
 * fetch entrust by entrustId (details page)
 */
export const fetchEntrustById = async (entrustId) => {
  try {
    const q = query(
      collectionGroup(db, "entrusts"),
      where("entrustId", "==", entrustId),
      orderBy("createdAt", "asc")
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.warn(`找不到 entrustId 為 ${entrustId} 的委託`);
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    const entrustData = docSnap.data();

    return {
      id: docSnap.id,
      ...entrustData,
    };
  } catch (error) {
    console.error("獲取委託失敗:", error);
    return null;
  }

};