// services/artworkMarketService.js

import { db } from "@/lib/firebase";
import { collectionGroup,collection, addDoc, getDoc,setDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { uploadImage } from "./storageService";

/**
 * 上傳作品到 Firestore 與 Storage
 */
export const uploadArtwork = async (userUid, userSerialId, formData) => {
    try {
      const artworkId = userSerialId + "_" + Date.now().toString();
  
      // 上傳範例圖片
      let exampleImageUrl = "";
      if (formData.exampleImage?.file) {
        exampleImageUrl = await uploadImage(
          formData.exampleImage.file,
          `artworkMarket/${userSerialId}/${artworkId}/exampleImage.jpg`
        );
      }
  
      //  確保 supplementaryImages 總是陣列
      const supplementaryImages = formData.supplementaryImages || [];
  
      // 上傳補充圖片
      const supplementaryImageUrls = await Promise.all(
        supplementaryImages.map((img, index) =>
          uploadImage(
            img.file,
            `artworkMarket/${userSerialId}/${artworkId}/supplementaryImage_${index + 1}.jpg`
          )
        )
      );
  
    // 過濾掉不支援的欄位（例如 File 物件）
    const { exampleImage, supplementaryImages: _, ...filteredFormData } = formData; // 過濾掉 exampleImage 與 supplementaryImages

    // 儲存資料到 Firestore（僅純資料）
    const artworkData = {
        ...filteredFormData, 
        userId: userSerialId,
        userUid: userUid,
        artworkId: artworkId,
        exampleImageUrl: exampleImageUrl, 
        supplementaryImageUrls: supplementaryImageUrls,
        createdAt: serverTimestamp(),
    };

    // ✅ 寫入 Firestore
    const artworkRef = doc(db, "artworkMarket", userUid, "artworks", artworkId);
    await setDoc(artworkRef, artworkData);

    return { success: true, message: "作品上傳成功", artworkId };
} catch (error) {
    console.error("作品上傳失敗:", error);
    return { success: false, message: error.message };
}
};

/**
 * 獲取指定作者的作品
 */
export const fetchUserArtworks = async (userUid) => {
  try {
    const q = query(
      collection(db, "artworkMarket", userUid, "artworks"), // 🔥 這裡重點：使用子集合
      orderBy("createdAt", "asc") // 依照創建時間排序
    );

    const querySnapshot = await getDocs(q);
    const artworks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return artworks;
  } catch (error) {
    console.error("獲取作品失敗:", error);
    return [];
  }
};

/**
 * 獲取所有作品
 */
export const fetchAllUserArtworks = async () => {
  try {
    //  獲取 artworkMarket 中的所有作品
    const q = query(
      collectionGroup(db, "artworks"),
      orderBy("createdAt", "asc"),
      orderBy("marketName", "asc")
    );
    const querySnapshot = await getDocs(q);

    console.log("querySnapshot size:", querySnapshot.size);

    //  並行獲取對應使用者資料
    const artworksWithArtistData = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const artworkData = docSnap.data();
        const userUid = artworkData.userUid; 

     
        // 使用 userUid 查找 users 集合
        const userDocRef = doc(db, "users", userUid);
        const userDocSnap = await getDoc(userDocRef);
       

        let artistProfileImg = "/images/kv-min-4.png"; 
        let artistNickName = "使用者名稱"; 

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          artistProfileImg = userData.profileAvatar || artistProfileImg;
          artistNickName = userData.nickname || artistNickName;
        } else {
          console.warn(`找不到 userUid 為 ${userUid} 的使用者`);
        }

        return {
          id: docSnap.id,
          ...artworkData,
          artistProfileImg,
          artistNickName,
        };
      })
    );

    return artworksWithArtistData;
  } catch (error) {
    console.error("獲取作品失敗:", error);
    return [];
  }
};

/**fetch artwork user avatar and user nickname */

/**
 * 更新指定作品資料
 */


/**
 * 刪除指定作品
 */

