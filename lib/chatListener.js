import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { store } from "@/app/redux/store";
import {
  setChats,
  addChat,
  updateChat,
} from "@/app/redux/feature/chatSlice";

/**
 * 監聽當前使用者相關的聊天室資料
 * @param {string} userUid - 當前登入使用者的 UID
 * @returns {function} - Firebase 的 unsubscribe 函數
 */

export const subscribeToChats = (userUid) => {
  if (!userUid) {
    return () => {}; // no-op unsubscribe
  }

  try {
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", userUid),
      orderBy("lastUpdated", "desc")
    );

    let isInitialLoad = true;

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const initialChats = [];

        snapshot.docChanges().forEach((change) => {
          const chatData = { id: change.doc.id, ...change.doc.data() };

          if (isInitialLoad) {
            if (change.type === "added") {
              initialChats.push(chatData);
            }
          } else {
            switch (change.type) {
              case "added":
                store.dispatch(addChat(chatData));
                break;
              case "modified":
                store.dispatch(updateChat(chatData));
                break;
              default:
                console.warn("[subscribeToChats] Unhandled change type:", change.type);
            }
          }
        });

        if (isInitialLoad) {
          store.dispatch(setChats(initialChats));
          isInitialLoad = false;
        }
      },
      (error) => {
        if (error.code === "permission-denied") {
          console.debug("[subscribeToChats] Permission denied for user:", userUid);
        } else {
          console.error("訂閱 chats 發生錯誤:", error.message);
        }
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error(" 建立 chats 訂閱失敗:", error.message);
    return () => {};
  }
};
