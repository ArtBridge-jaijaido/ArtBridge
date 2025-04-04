import { db, storage} from "@/lib/firebase";
import { collectionGroup,collection, addDoc, getDoc,setDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, deleteDoc, orderBy , Timestamp } from "firebase/firestore";
import { uploadImage } from "./storageService";
import { ref, deleteObject } from "firebase/storage";
import {createLowResImage} from "@/lib/functions";

export const uploadPortfolio = async (userUid, userSerialId, formData) => {
    try {
        const portfolioId = userSerialId + "_" + Date.now().toString()+"_"+"portfolio";
         //  上傳作品圖片
        let exampleImageUrl = "";
        let blurredImageUrl = "";
        if (formData.exampleImage?.file) {
            exampleImageUrl = await uploadImage(
                formData.exampleImage.file,
                `artworkPortfolio/${userSerialId}/${portfolioId}/exampleImage.jpg`
            );

             //  生成低解析度圖片
             const blurredImageFile = await createLowResImage(formData.exampleImage.file);

             //  上傳低解析度圖片
             blurredImageUrl = await uploadImage(
                 blurredImageFile,
                 `artworkPortfolio/${userSerialId}/${portfolioId}/exampleImage_blurred.jpg`
             );
        }
        // 過濾掉不支援的欄位（例如 File 物件）
        const { exampleImage, ...filteredFormData } = formData;

         // 準備要存入 Firestore 的資料
         const portfolioData = {
            ...filteredFormData, 
            userId: userSerialId,
            userUid: userUid,
            portfolioId: portfolioId,
            exampleImageUrl: exampleImageUrl,
            blurredImageUrl: blurredImageUrl, // 低解析度圖片
            createdAt: new Date().toISOString(),
        };

        // ✅ 寫入 Firestore
        const portfolioRef = doc(db, "artworkPortfolio", userUid, "portfolios", portfolioId);
        await setDoc(portfolioRef, portfolioData);
        return { success: true, message: "作品上傳成功", portfolioData };
    }
    catch (error) {
        console.error("作品上傳失敗:", error);
        return { success: false, message: error.message };
    }

};

/**
    取得特定使用者的作品集
 */
export const fetchUserPortfolios = async (userUid) => {
    try{
        const q= query(
            collection(db, "artworkPortfolio", userUid, "portfolios"),
            orderBy("createdAt", "asc")
        );
        const querySnapshot = await getDocs(q);
        const portfolios= querySnapshot.docs.map((doc)=>({ id: doc.id, ...doc.data() }));
        return portfolios;
    }catch(error){
        console.error("無法取得作品集:", error);
        return [];
    }
};



/**
 * 刪除作品集
 */
export const deletePortfolio = async (userUid, userId, portfolioId) => {
    try {
        // 1️⃣ 刪除 Firestore 中的 portfolio
        const portfolioRef = doc(db, "artworkPortfolio", userUid, "portfolios", portfolioId);
        await deleteDoc(portfolioRef);

        // 2️⃣ 刪除 Firebase Storage 中的圖片
        const imageRef = ref(storage, `artworkPortfolio/${userId}/${portfolioId}/exampleImage.jpg`);
        console.log("imageRef", imageRef);
        await deleteObject(imageRef);
        
        //刪除低解析度圖片
        const blurredImageRef = ref(storage, `artworkPortfolio/${userId}/${portfolioId}/exampleImage_blurred.jpg`);
        await deleteObject(blurredImageRef);

        return { success: true, message: "作品集刪除成功" };
    } catch (error) {
        console.error("刪除作品集失敗:", error);
        return { success: false, message: error.message };
    }
};


// 更新作品集
export const updatePortfolio = async (userUid, portfolioId, updatedData) => {
    try {
        //  指向 Firestore 中的作品文件
        const portfolioRef = doc(db, "artworkPortfolio", userUid, "portfolios", portfolioId);
        
        //  更新 Firestore 資料
        await updateDoc(portfolioRef, updatedData);
        
        return { success: true };
    } catch (error) {
        console.error("更新作品資料失敗:", error);
        return { success: false, error };
    }
};