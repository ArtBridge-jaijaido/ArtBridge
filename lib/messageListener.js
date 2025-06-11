// lib/messageListener.js
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { store } from "@/app/redux/store";
import {
  setMessages,
  addMessage,
} from "@/app/redux/feature/messageSlice";

/**
 * 訂閱某個聊天室的訊息
 * @param {string} chatId - 要監聽的聊天室 ID
 * @returns {function} - unsubscribe 函式
 */

export const subscribeToMessages = (chatId) => {
  if (!chatId) return () => {};

  try {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc"),
      orderBy("senderUid", "asc")
    );

    let isInitialLoad = true;
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = [];

      snapshot.docChanges().forEach((change) => {
        const messageData = { id: change.doc.id, ...change.doc.data() };

        if (isInitialLoad) {
          if (change.type === "added") {
            newMessages.push(messageData);
          }
        } else {
          if (change.type === "added") {
            store.dispatch(addMessage({ chatId, message: messageData }));
          }
        }
      });

      if (isInitialLoad) {
        store.dispatch(setMessages({ chatId, messages: newMessages }));
        isInitialLoad = false;
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error("建立 messages 訂閱失敗：", error.message);
    return () => {};
  }
};
