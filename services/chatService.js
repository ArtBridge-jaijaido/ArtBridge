import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";


export async function createChatWithMessage({ participants, senderUid, text, orderId }) {
  try {
    // 1. 建立 chatId（使用 orderId 為主，否則用排序後的 UID 組合）

    console.log(participants);
    const chatId = orderId
      ? `order-${orderId}`
      : participants.sort().join("_");

    const chatRef = doc(db, "chats", chatId);

    const chatSnap = await getDoc(chatRef);

    // 2. 若聊天室不存在就創建
    if (!chatSnap.exists()) {
      const payload = {
        participants,
        lastMessage: text,
        lastSender: senderUid,
        lastUpdated: new Date().toISOString(),
        unreadCounts: {
          [participants[0]]: participants[0] === senderUid ? 0 : 1,
          [participants[1]]: participants[1] === senderUid ? 0 : 1,
        },
        createdAt: new Date().toISOString(),
      };


      await setDoc(chatRef, payload);
      console.log(" 聊天室已建立");
    } else {
      // 3. 若聊天室已存在就只更新
      await updateDoc(chatRef, {
        lastMessage: text,
        lastSender: senderUid,
        lastUpdated: new Date().toISOString(),
        [`unreadCounts.${participants.find((id) => id !== senderUid)}`]: 1,
      });
      console.log(" 聊天室已存在，已更新 lastMessage");
    }

    // 4. 寫入訊息到 messages 子集合
    const messageRef = collection(chatRef, "messages");
    await addDoc(messageRef, {
      senderUid,
      text,
      createdAt: new Date().toISOString(),
      readBy: [senderUid],
    });

    console.log(" 初始訊息已發送");

  } catch (error) {
    console.error("建立聊天室與訊息失敗", error);
  }
}
