import { db, storage} from "@/lib/firebase";
import { collectionGroup,collection, addDoc, getDoc,setDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { uploadImage } from "./storageService";
import { ref, deleteObject } from "firebase/storage";

export const uploadPortfolio = async (userUid, userSerialId, formData) => {
    try {
        const portfolioId = userSerialId + "_" + Date.now().toString()+"_"+"portfolio";
         //  上傳作品圖片
        let exampleImageUrl = "";
        if (formData.exampleImage?.file) {
            exampleImageUrl = await uploadImage(
                formData.exampleImage.file,
                `artworkPortfolio/${userSerialId}/${portfolioId}/exampleImage.jpg`
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
            createdAt: serverTimestamp(),
        };

        // ✅ 寫入 Firestore
        const portfolioRef = doc(db, "artworkPortfolio", userUid, "portfolios", portfolioId);
        await setDoc(portfolioRef, portfolioData);
        return { success: true, message: "作品上傳成功", portfolioId };
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

        return { success: true, message: "作品集刪除成功" };
    } catch (error) {
        console.error("刪除作品集失敗:", error);
        return { success: false, message: error.message };
    }
};