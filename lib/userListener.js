import { db } from "@/lib/firebase";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { store } from "@/app/redux/store";
import { updateArtwork } from "@/app/redux/feature/artworkSlice";
import { setAllUsers, updateAllUser } from "@/app/redux/feature/userSlice";

export const subscribeToUsers = () => {
    const usersRef = collection(db, "users");

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            const userUid = change.doc.id;
            const userData = change.doc.data();

            console.log("User change type:", change.type);

            if (change.type === "added" || change.type === "modified") {

                console.log("User modified:", userData); 
                // ✅ 獲取當前 artworks
                const artworks = store.getState().artwork.artworks;

                // ✅ 遍歷 artworks，找出與修改過的 user 對應的作品
                artworks.forEach((artwork) => {
                    if (artwork.userUid === userUid) {
                        // ✅ 檢查是否真的有變更
                        const isNicknameChanged = artwork.artistNickName !== userData.nickname;
                        const isAvatarChanged = artwork.artistProfileImg !== userData.profileAvatar;

                        if (isNicknameChanged || isAvatarChanged) {
                            // ✅ 確保新物件參考以觸發 re-render
                            const updatedArtwork = {
                                ...artwork,
                                artistProfileImg: userData.profileAvatar,
                                artistNickName: userData.nickname,
                            };

                            // ✅ 單筆 dispatch 更新
                            store.dispatch(updateArtwork(updatedArtwork));
                        }
                    }
                });
            }
        });
    });

    return unsubscribe;
};


export const subscribeToAllUsers = async () => {
    const usersRef = collection(db, "users");

    //  先一次性載入所有 users，避免初次進入時 Redux 沒有資料
    try {
        const snapshot = await getDocs(usersRef);
        const users = {};
        snapshot.forEach((doc) => {
            const userData = doc.data();
            users[doc.id] = {
                ...userData,
                createdAt: userData.createdAt?.toDate?.().toISOString() || userData.createdAt, // 確保可序列化
            };
        });
        store.dispatch(setAllUsers(users)); // 存入 Redux
    } catch (error) {
        console.error("❌ Error fetching users:", error);
    }

    // ✅ 啟動監聽 Firestore `users`，當有變更時自動更新 Redux
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            const userUid = change.doc.id;
            const userData = change.doc.data();

            if (change.type === "added" || change.type === "modified") {
                store.dispatch(updateAllUser({
                    userUid, 
                    userData: {
                        ...userData,
                        createdAt: userData.createdAt?.toDate?.().toISOString() || userData.createdAt, //  確保可序列化
                    }
                }));
            }
        });
    });

    return unsubscribe;
};