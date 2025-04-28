import { db } from "@/lib/firebase";
import {
  collectionGroup,
  collection,
  getDoc,
  setDoc,
  getDocs,
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

    // 上傳補充圖片（如有）
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
      createdAt: serverTimestamp(),
    };

    const entrustRef = doc(db, "entrustMarket", userUid, "entrusts", entrustId);
    await setDoc(entrustRef, entrustData);

    return { success: true, message: "委託上傳成功", entrustId };
  } catch (error) {
    console.error("委託上傳失敗:", error);
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
 * 獲取所有委託（含使用者資料）
 */
export const fetchAllUserEntrusts = async () => {
  try {
    const q = query(
      collectionGroup(db, "entrusts"),
      orderBy("createdAt", "asc"),
      orderBy("title", "asc")
    );

    const querySnapshot = await getDocs(q);

    const entrustsWithUserData = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const entrustData = docSnap.data();
        const userUid = entrustData.userUid;

        const userDocRef = doc(db, "users", userUid);
        const userDocSnap = await getDoc(userDocRef);

        let userProfileImg = "/images/kv-min-4.png";
        let userNickName = "使用者名稱";

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          userProfileImg = userData.profileAvatar || userProfileImg;
          userNickName = userData.nickname || userNickName;
        }

        return {
          id: docSnap.id,
          ...entrustData,
          userProfileImg,
          userNickName,
        };
      })
    );

    return entrustsWithUserData;
  } catch (error) {
    console.error("獲取所有委託失敗:", error);
    return [];
  }
};
