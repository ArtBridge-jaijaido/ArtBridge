import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  arrayUnion,
} from "firebase/firestore";

/**
 * 建立聊天室並發送第一則訊息
 * @param {Object} options
 * @param {string[]} options.participants - 雙方 uid 陣列
 * @param {string} options.senderUid - 發送者 uid
 * @param {string} options.type - 訊息類型: "text" | "image" | "system" | "milestoneConfirm" | "..."
 * @param {string} [options.orderId] - 若是委託建立，使用 orderId 作為聊天室 id
 * @param {string} [options.text] - 簡化顯示的訊息摘要（用於聊天室列表）
 * @param {object} [options.payload] - 訊息詳細內容（例如圖片、milestone 資訊等）
 */

export async function createChatWithMessage({ participants, senderUid, type = "text", content = "",  payload = {}, orderId }) {
  try {
    const chatId = orderId ? `order-${orderId}` : participants.sort().join("_");
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    const now = new Date().toISOString();
    const unreadCounts = {
      [participants[0]]: participants[0] === senderUid ? 0 : 1,
      [participants[1]]: participants[1] === senderUid ? 0 : 1,
    };

    // 建立聊天室（如果不存在）
    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants,
        lastMessage: content,
        lastSender: senderUid,
        lastUpdated: now,
        unreadCounts,
        createdAt: now,
        orderId: orderId || null,
      });
    } else {
      await updateDoc(chatRef, {
        lastMessage: content,
        lastSender: senderUid,
        lastUpdated: now,
        [`unreadCounts.${participants.find((id) => id !== senderUid)}`]: 1,
      });
    }

    // 寫入訊息
    const messageRef = collection(chatRef, "messages");
    await addDoc(messageRef, {
      senderUid,
      type,
      text: content,
      payload,
      createdAt: now,
      readBy: [senderUid],
    });

    console.log("訊息已發送");
  } catch (error) {
    console.error("createChatWithMessage 錯誤:", error);
  }
}



export async function markMessagesAsRead(chatId, userUid) {
  try {
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      [`unreadCounts.${userUid}`]: 0,
    });
    console.log(`成功將聊天室 ${chatId} 的 ${userUid} 未讀數清零`);
  } catch (error) {
    console.error(" 無法標記訊息為已讀：", error);
  }
}