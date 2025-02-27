// lib/artworkListener.js
import { db } from "@/lib/firebase";
import { collectionGroup, onSnapshot, query, orderBy } from "firebase/firestore";
import { store } from "@/app/redux/store";
import { setArtworks, addArtwork, updateArtwork, deleteArtwork } from "@/app/redux/feature/artworkSlice";
import { getUserData } from "@/services/userService";

export const subscribeToArtworks = () => {
    const artworksQuery = query(
        collectionGroup(db, "artworks"),
        orderBy("createdAt", "asc"),
        orderBy("marketName", "asc")
    );

    let isInitialLoad = true;
    const userCache = {}; // 用來緩存已經請求過的 user data，避免重複請求

    const unsubscribe = onSnapshot(artworksQuery, async (querySnapshot) => {
        const artworks = [];

        // 使用 for...of 支援 async/await
        for (const change of querySnapshot.docChanges()) {
            const artworkData = { id: change.doc.id, ...change.doc.data() };
            const userUid = artworkData.userUid;

            // ✅ 檢查 cache 避免重複請求
            if (!userCache[userUid]) {
                const userResponse = await getUserData(userUid);
                if (userResponse.success) {
                    userCache[userUid] = userResponse.data;
                } else {
                    userCache[userUid] = { profileAvatar: "/images/kv-min-4.png", nickname: "使用者名稱" };
                }
            }

            // ✅ 將 user 資料整合進 artwork
            artworkData.artistProfileImg = userCache[userUid].profileAvatar;
            artworkData.artistNickName = userCache[userUid].nickname;

            // 轉換 Timestamp
            if (artworkData.createdAt?.toDate) {
                artworkData.createdAt = artworkData.createdAt.toDate().toISOString();
            }

            if (isInitialLoad) {
                artworks.push(artworkData);
            } else {
                switch (change.type) {
                    case "added":
                        store.dispatch(addArtwork(artworkData));
                        break;
                    case "modified":
                        store.dispatch(updateArtwork(artworkData));
                        break;
                    case "removed":
                        store.dispatch(deleteArtwork(artworkData.artworkId));
                        break;
                    default:
                        console.warn(`Unhandled change type: ${change.type}`);
                }
            }
        }

        if (isInitialLoad) {
            store.dispatch(setArtworks(artworks));
            isInitialLoad = false;
        }

       
    });

    return unsubscribe;
};
