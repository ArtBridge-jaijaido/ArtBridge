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


export const subscribeToAllUsers = () => {
    

    const usersRef = collection(db, "users");
    let isInitialLoad = true;

    // ✅ Firestore 監聽 `users` 集合
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
        const users = {};

        if (isInitialLoad) {
            console.log("🔥 正在初始化 users...");
            snapshot.forEach((doc) => {
                const userUid = doc.id;
                const userData = doc.data();
                const { verificationCodeExpiresAt, ...filteredUserData } = userData;

                users[userUid] = {
                    ...filteredUserData,
                    createdAt: userData.createdAt?.toDate?.().toISOString() || userData.createdAt,
                };
            });

            //  存入 Redux 並確認更新是否生效
            store.dispatch(setAllUsers(users));
            
            isInitialLoad = false;
        } else {
            console.log("🔄 監聽到用戶變更...");
            snapshot.docChanges().forEach((change) => {
                const userUid = change.doc.id;
                const userData = change.doc.data();
                const { verificationCodeExpiresAt, ...filteredUserData } = userData;

                if (change.type === "added" || change.type === "modified") {
                    store.dispatch(updateAllUser({
                        userUid,
                        userData: {
                            ...filteredUserData,
                            createdAt: userData.createdAt?.toDate?.().toISOString() || userData.createdAt,
                        }
                    }));
                    console.log("🔄 更新用戶:", userUid, store.getState().user.allUsers[userUid]);
                }
            });
        }
    });

    return unsubscribe; // ✅ 返回取消監聽函數
};

