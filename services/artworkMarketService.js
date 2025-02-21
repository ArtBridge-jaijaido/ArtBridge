// services/artworkMarketService.js

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { uploadImage } from "./storageService";

/**
 * 上傳作品到 Firestore 與 Storage
 */
export const uploadArtwork = async (userId, formData) => {
    try {
      const artworkId = userId + "_" + Date.now().toString();
  
      // 上傳範例圖片
      let exampleImageUrl = "";
      if (formData.exampleImage?.file) {
        exampleImageUrl = await uploadImage(
          formData.exampleImage.file,
          `artworkMarket/${userId}/${artworkId}/exampleImage.jpg`
        );
      }
  
      //  確保 supplementaryImages 總是陣列
      const supplementaryImages = formData.supplementaryImages || [];
  
      // 上傳補充圖片
      const supplementaryImageUrls = await Promise.all(
        supplementaryImages.map((img, index) =>
          uploadImage(
            img.file,
            `artworkMarket/${userId}/${artworkId}/supplementaryImage_${index + 1}.jpg`
          )
        )
      );
  
      // 儲存資料到 Firestore
      const artworkData = {
        ...formData,
        userId: userId,
        artworkId: artworkId,
        exampleImageUrl: exampleImageUrl,
        supplementaryImageUrls: supplementaryImageUrls,
        createdAt: serverTimestamp(),
      };

      delete artworkData.exampleImage;
      delete artworkData.supplementaryImages;
  
      await addDoc(collection(db, "artworkMarket"), artworkData);
  
      return { success: true, message: "作品上傳成功", artworkId };
    } catch (error) {
      console.error("作品上傳失敗:", error);
      return { success: false, message: error.message };
    }
  };
  

/**
 * 獲取指定作者的作品
 */
export const fetchUserArtworks = async (userId) => {
  try {
    const q = query(collection(db, "artworkMarket"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const artworks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return artworks;
  } catch (error) {
    console.error("獲取作品失敗:", error);
    return [];
  }
};

/**
 * 更新指定作品資料
 */
export const updateArtwork = async (artworkId, updatedFields) => {
  try {
    const artworkRef = doc(db, "artworkMarket", artworkId);
    await updateDoc(artworkRef, updatedFields);
    return { success: true, message: "作品更新成功" };
  } catch (error) {
    console.error("更新作品失敗:", error);
    return { success: false, message: error.message };
  }
};

/**
 * 刪除指定作品
 */
export const deleteArtwork = async (artworkId) => {
  try {
    const artworkRef = doc(db, "artworkMarket", artworkId);
    await deleteDoc(artworkRef);
    return { success: true, message: "作品刪除成功" };
  } catch (error) {
    console.error("刪除作品失敗:", error);
    return { success: false, message: error.message };
  }
};

