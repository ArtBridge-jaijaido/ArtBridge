// lib/authListener.js
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { store } from "@/app/redux/store";
import { setUser, logoutUser } from "@/app/redux/feature/userSlice";


export const subscribeToAuth = () => {
  let unsubscribeUserSnapshot = null;

  const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken(); // 取得 Firebase ID Token

        // 發送 Token 給 API，存入 `httpOnly` Cookie
        await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        // 監聽 Firestore 使用者資料變化
        const userRef = doc(db, "users", user.uid);
        unsubscribeUserSnapshot = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = { uid: user.uid, ...snapshot.data() };

            const { verificationCodeExpiresAt, ...filteredUserData } = userData;
            
            store.dispatch(setUser({
              ...filteredUserData,
              createdAt: userData.createdAt?.toDate().toISOString() || null,
            }));
          } else {
            console.error("Firestore 找不到使用者資料");
            store.dispatch(logoutUser());
          }
        });
      } catch (error) {
        console.error("獲取 Token 失敗:", error);
        store.dispatch(logoutUser());
      }
    } else {
      store.dispatch(logoutUser()); // 使用者登出時清除 Redux
      if (unsubscribeUserSnapshot) unsubscribeUserSnapshot(); // 停止 Firestore 監聽
    }
  });

  return () => {
    unsubscribeAuth();
    if (unsubscribeUserSnapshot) unsubscribeUserSnapshot(); // 確保監聽清除
  };
};
