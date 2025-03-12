import { db, storage} from "@/lib/firebase";
import { collectionGroup,collection, addDoc, getDoc,setDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { uploadImage } from "./storageService";
import { ref, deleteObject } from "firebase/storage";
import {createLowResImage} from "@/lib/functions";


/*上傳文章*/
export const uploadArticle = async (userUid, userSerialId, formData) => {
    try{
        const articleId = userSerialId + "_" + Date.now().toString()+"_"+"article";

        // 上傳文章圖片
        let exampleImageUrl  = "";
        let blurredImageUrl = ""; 

        if (formData.exampleImage?.file) {
            exampleImageUrl  = await uploadImage(
                formData.exampleImage.file,
                `artworkArticle/${userSerialId}/${articleId}/exampleImage.jpg`
            );

            // 生成低解析度圖片
            const blurredImageFile = await createLowResImage(formData.exampleImage.file);

            // 上傳低解析度圖片
            blurredImageUrl = await uploadImage(
                blurredImageFile,
                `artworkArticle/${userSerialId}/${articleId}/exampleImage_blurred.jpg`
            );
        }

        // 過濾掉不支援的欄位（例如 File 物件）
        const {exampleImage, ...filteredFormData} = formData;

        // 準備要存入 Firestore 的資料
        const articleData = {
            ...filteredFormData,
            userId: userSerialId,
            userUid: userUid,
            articleId: articleId,
            exampleImageUrl: exampleImageUrl,
            blurredImageUrl: blurredImageUrl, // 低解析度圖片
            createdAt: serverTimestamp(),
        };

        // ✅ 寫入 Firestore
        const articleRef = doc(db, "artworkArticle", userUid, "articles", articleId);
        await setDoc(articleRef, articleData);
        return { success: true, message: "文章上傳成功", articleId };
    }
    catch (error){
        console.error("文章上傳失敗:", error);
        return { success: false, message: error.message };
    }

};
