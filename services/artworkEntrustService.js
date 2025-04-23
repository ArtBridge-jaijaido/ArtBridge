import { db } from "@/lib/firebase";
import { collectionGroup, collection, addDoc, getDoc, setDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, deleteDoc, orderBy, arrayUnion, arrayRemove } from "firebase/firestore";
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

        // 補充圖片處理（如有）
        const supplementaryImages = formData.supplementaryImages || [];
        const supplementaryImageUrls = await Promise.all(
            supplementaryImages.map((img, index) =>
                uploadImage(
                    img.file,
                    `entrustMarket/${userSerialId}/${entrustId}/supplementaryImage_${index + 1}.jpg`
                )
            )
        );

        // 過濾掉 File 物件
        const { exampleImage, supplementaryImages: _, ...filteredFormData } = formData;

        const entrustData = {
            ...filteredFormData,
            userId: userSerialId,
            userUid: userUid,
            entrustId: entrustId,
            exampleImageUrl,
            supplementaryImageUrls,
            likes: 0,
            likedBy: [],
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
 * 獲取所有委託
 */
export const fetchAllUserEntrusts = async () => {
    try {
        const q = query(
            collectionGroup(db, "entrusts"),
            orderBy("createdAt", "asc"),
            orderBy("title", "asc")
        );

        const querySnapshot = await getDocs(q);
        console.log("querySnapshot size:", querySnapshot.size);

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

/**
 * toggleEntrustLike
 */
export const toggleEntrustLike = async (entrustOwnerUid, entrustId, currentUserUid) => {
    try {
        const entrustRef = doc(db, "entrustMarket", entrustOwnerUid, "entrusts", entrustId);
        const docSnap = await getDoc(entrustRef);

        if (!docSnap.exists()) {
            console.warn("找不到委託，無法切換愛心狀態");
            return { success: false, message: "委託不存在" };
        }

        const data = docSnap.data();
        const hasLiked = data.likedBy?.includes(currentUserUid);

        if (hasLiked) {
            await updateDoc(entrustRef, {
                likes: data.likes - 1,
                likedBy: arrayRemove(currentUserUid),
            });
            return { success: true, liked: false };
        } else {
            await updateDoc(entrustRef, {
                likes: data.likes + 1,
                likedBy: arrayUnion(currentUserUid),
            });
            return { success: true, liked: true };
        }
    } catch (error) {
        console.error("切換委託愛心狀態失敗:", error);
        return { success: false, message: error.message };
    }
};

/**
 * 獲取使用者按讚的委託
 */
export const fetchLikedEntrustsByUser = async (currentUserUid) => {
    try {
        const q = query(
            collectionGroup(db, "entrusts"),
            where("likedBy", "array-contains", currentUserUid),
            orderBy("createdAt", "asc")
        );

        const querySnapshot = await getDocs(q);
        const likedEntrusts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return { success: true, data: likedEntrusts };
    } catch (error) {
        console.error("查詢使用者按過讚的 entrusts 失敗：", error);
        return { success: false, message: error.message };
    }
};
