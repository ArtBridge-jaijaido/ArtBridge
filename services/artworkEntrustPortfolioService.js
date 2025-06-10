import { db, storage } from "@/lib/firebase";
import {
  collection,
  getDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { uploadImage } from "./storageService";
import { ref, deleteObject } from "firebase/storage";
import { createLowResImage } from "@/lib/functions";

const basePath = "entrustPortfolio";

export const uploadEntrustPortfolio = async (userUid, userSerialId, formData) => {
  try {
    const portfolioId = `${userSerialId}_${Date.now()}_portfolio`;

    let exampleImageUrl = "";
    let blurredImageUrl = "";

    if (formData.exampleImage?.file) {
      exampleImageUrl = await uploadImage(
        formData.exampleImage.file,
        `${basePath}/${userSerialId}/${portfolioId}/exampleImage.jpg`
      );

      const blurredImageFile = await createLowResImage(formData.exampleImage.file);

      blurredImageUrl = await uploadImage(
        blurredImageFile,
        `${basePath}/${userSerialId}/${portfolioId}/exampleImage_blurred.jpg`
      );
    }

    const { exampleImage, ...filteredFormData } = formData;

    const portfolioData = {
      ...filteredFormData,
      userId: userSerialId,
      userUid,
      portfolioId,
      exampleImageUrl,
      blurredImageUrl,
      createdAt: new Date().toISOString(),
    };

    const portfolioRef = doc(db, basePath, userUid, "entrustportfolios", portfolioId);
    await setDoc(portfolioRef, portfolioData);
    return { success: true, message: "委託作品上傳成功", portfolioData };
  } catch (error) {
    console.error("委託作品上傳失敗:", error);
    return { success: false, message: error.message };
  }
};

export const fetchUserEntrustPortfolios = async (userUid) => {
  try {
    const q = query(
      collection(db, basePath, userUid, "entrustportfolios"),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("無法取得委託作品集:", error);
    return [];
  }
};

export const deleteEntrustPortfolio = async (userUid, userId, portfolioId) => {
  try {
    const portfolioRef = doc(db, basePath, userUid, "entrustportfolios", portfolioId);
    await deleteDoc(portfolioRef);

    const imageRef = ref(storage, `${basePath}/${userId}/${portfolioId}/exampleImage.jpg`);
    await deleteObject(imageRef);

    const blurredImageRef = ref(storage, `${basePath}/${userId}/${portfolioId}/exampleImage_blurred.jpg`);
    await deleteObject(blurredImageRef);

    return { success: true, message: "委託作品集刪除成功" };
  } catch (error) {
    console.error("刪除委託作品集失敗:", error);
    return { success: false, message: error.message };
  }
};

export const updateEntrustPortfolio = async (userUid, portfolioId, updatedData) => {
  try {
    const portfolioRef = doc(db, basePath, userUid, "entrustportfolios", portfolioId);
    await updateDoc(portfolioRef, updatedData);
    return { success: true };
  } catch (error) {
    console.error("更新委託作品資料失敗:", error);
    return { success: false, error };
  }
};

export const checkEntrustPortfolioIdExists = async (userUid, portfolioId) => {
  try {
    const portfolioRef = doc(db, basePath, userUid, "entrustportfolios", portfolioId);
    const docSnap = await getDoc(portfolioRef);
    return docSnap.exists();
  } catch (error) {
    console.error("檢查委託作品集 ID 是否存在時發生錯誤:", error);
    return false;
  }
};
