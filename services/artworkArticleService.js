import { db, storage } from "@/lib/firebase";
import { collectionGroup, collection, addDoc, getDoc, setDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, deleteDoc, orderBy, arrayUnion, arrayRemove } from "firebase/firestore";
import { uploadImage } from "./storageService";
import { ref, deleteObject } from "firebase/storage";
import { createLowResImage } from "@/lib/functions";


/*上傳文章*/
export const uploadArticle = async (userUid, userSerialId, formData) => {
    try {
        const articleId = userSerialId + "_" + Date.now().toString() + "_" + "article";

        // 上傳文章圖片
        let exampleImageUrl = "";
        let blurredImageUrl = "";

        if (formData.exampleImage?.file) {
            exampleImageUrl = await uploadImage(
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
        const { exampleImage, ...filteredFormData } = formData;

        // 準備要存入 Firestore 的資料
        const articleData = {
            ...filteredFormData,
            userId: userSerialId,
            userUid: userUid,
            articleId: articleId,
            exampleImageUrl: exampleImageUrl,
            blurredImageUrl: blurredImageUrl, // 低解析度圖片
            likes: 0,
            likedBy: [],
            collections: 0,
            collectedBy: [],
            reportedBy: [],
            createdAt: new Date().toISOString(),
        };

        // ✅ 寫入 Firestore
        const articleRef = doc(db, "artworkArticle", userUid, "articles", articleId);
        await setDoc(articleRef, articleData);
        return { success: true, message: "文章上傳成功", articleData };
    }
    catch (error) {
        console.error("文章上傳失敗:", error);
        return { success: false, message: error.message };
    }

};


/**
 * 刪除文章
 */


export const deleteArticle = async (userUid, userId, articleId) => {
    try {
        // 刪除 Firestore 中的文章
        const articleRef = doc(db, "artworkArticle", userUid, "articles", articleId);
        await deleteDoc(articleRef);

        // 刪除 Storage 中的圖片
        const exampleImageRef = ref(storage, `artworkArticle/${userId}/${articleId}/exampleImage.jpg`);
        await deleteObject(exampleImageRef);

        // 刪除 Storage 中的低解析度圖片
        const blurredImageRef = ref(storage, `artworkArticle/${userId}/${articleId}/exampleImage_blurred.jpg`);
        await deleteObject(blurredImageRef);

        return { success: true, message: "文章刪除成功" };
    } catch (error) {
        console.error("文章刪除失敗:", error);
        return { success: false, message: error.message };
    }
};


/*
* 更新文章圖片
*/

export const updateArticleImage = async ({ userId, articleId, userUid, file }) => {
    try {
        const blurredImageFile = await createLowResImage(file);

        // 上傳文章圖片
        const newExampleImageUrl = await uploadImage(file, `artworkArticle/${userId}/${articleId}/exampleImage.jpg`);
        const newBlurredImageUrl = await uploadImage(blurredImageFile, `artworkArticle/${userId}/${articleId}/exampleImage_blurred.jpg`);


        // 更新 Firebase 中的文章資料
        const articleRef = doc(db, "artworkArticle", userUid, "articles", articleId);
        await updateDoc(articleRef, {

            exampleImageUrl: newExampleImageUrl,
            blurredImageUrl: newBlurredImageUrl,
        });

        return { success: true, exampleImageUrl: newExampleImageUrl, blurredImageUrl: newBlurredImageUrl };
    }
    catch (error) {
        console.error("更新文章圖片失敗:", error);
        return { success: false, message: error.message };
    }
};


/**
 * 更新文章資料
 */

export const updateArticleData = async ({ userUid, articleId, updateData }) => {
    try {
        // 取得 Firestore 文章參考
        const articleRef = doc(db, "artworkArticle", userUid, "articles", articleId);

        // 更新 Firestore 文件，動態更新傳入的 `updateData`
        await updateDoc(articleRef, {
            ...updateData,
        });
        return { success: true, message: "文章資料更新成功" };
    } catch (error) {
        console.error("更新文章資料失敗:", error);
        return { success: false, message: error.message };
    }
};


/**
 * 確認文章是否存在
 */
export const checkArticleExists = async (userUid, articleId) => {
    try {
        const articleRef = doc(db, "artworkArticle", userUid, "articles", articleId);
        const docSnap = await getDoc(articleRef);
        return docSnap.exists(); // 直接回傳 true 或 false
    } catch (error) {
        console.error("檢查文章是否存在失敗:", error);
        return false; // 失敗也回傳 false
    }
};


/**
 * toggle 愛心狀態
 */

export const toggleArticleLike = async (articleOwnerUid, articleId, currentUserUid) => {
    try {
        const articleRef = doc(db, "artworkArticle", articleOwnerUid, "articles", articleId);
        const docSnap = await getDoc(articleRef);

        if (!docSnap.exists()) {
            console.warn("找不到文章，無法切換愛心狀態");
            return { success: false, message: "文章不存在" };
        }

        const data = docSnap.data();
        const hasLiked = data.likedBy?.includes(currentUserUid);

        if (hasLiked) {
            await updateDoc(articleRef, {
                likes: data.likes - 1,
                likedBy: arrayRemove(currentUserUid),
            });
            return { success: true, liked: false };
        } else {
            await updateDoc(articleRef, {
                likes: data.likes + 1,
                likedBy: arrayUnion(currentUserUid),
            });
            return { success: true, liked: true };
        }
    } catch (error) {
        console.error("切換愛心狀態失敗:", error);
        return { success: false, message: error.message };
    }
};


/**
 * toggle 收藏狀態
 */
export const toggleArticleCollect = async (articleOwnerUid, articleId, currentUserUid) => {
    try {
        const articleRef = doc(db, "artworkArticle", articleOwnerUid, "articles", articleId);
        const docSnap = await getDoc(articleRef);

        if (!docSnap.exists()) {
            console.warn("找不到文章，無法切換收藏狀態");
            return { success: false, message: "文章不存在" };
        }

        const data = docSnap.data();
        const hasCollected = data.collectedBy?.includes(currentUserUid);

        if (hasCollected) {
            await updateDoc(articleRef, {
                collections: data.collections - 1,
                collectedBy: arrayRemove(currentUserUid),
            });
            return { success: true, collected: false };
        } else {
            await updateDoc(articleRef, {
                collections: data.collections + 1,
                collectedBy: arrayUnion(currentUserUid),
            });
            return { success: true, collected: true };
        }
    } catch (error) {
        console.error("切換收藏狀態失敗:", error);
        return { success: false, message: error.message };
    }
};
