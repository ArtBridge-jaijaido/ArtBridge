import { db } from "@/lib/firebase";
import { collection, doc, addDoc, updateDoc, increment, getDoc} from "firebase/firestore";
import { uploadImage } from "./storageService";

export async function sendTextMessage(chat, senderUid, text) {
    if (!chat) throw new Error("Chat is required");
  
    const chatId = chat.id;
    const recipientUid = chat.participants.find((uid) => uid !== senderUid);
    const messageRef = collection(db, "chats", chatId, "messages");
    const now = new Date().toISOString();
  
    // 傳送訊息
    await addDoc(messageRef, {
      senderUid,
      type: "text",
      text,
      createdAt: now,
      readBy: [senderUid],
    });
  
    // 取得對方使用者的 currentOpenChatId
    let recipientOpenChatId = null;
    try {
      const recipientDoc = await getDoc(doc(db, "users", recipientUid));
      if (recipientDoc.exists()) {
        recipientOpenChatId = recipientDoc.data().currentOpenChatId;
      }
    } catch (err) {
      console.error("讀取對方使用者資料失敗", err);
    }
  
    const isRecipientReading = recipientOpenChatId === chatId;
  
    // 更新聊天列表資訊
    const chatUpdateData = {
      lastMessage: text,
      lastSender: senderUid,
      lastUpdated: now,
      [`unreadCounts.${senderUid}`]: 0,
    };
  
    if (!isRecipientReading) {
      chatUpdateData[`unreadCounts.${recipientUid}`] = increment(1);
    }
  
    await updateDoc(doc(db, "chats", chatId), chatUpdateData);
  }


  export async function sendImageMessage(chat, senderUid, file) {
    if (!chat) throw new Error("Chat is required");
    if (!file) throw new Error("Image file is required");
  
    const chatId = chat.id;
    const recipientUid = chat.participants.find((uid) => uid !== senderUid);
    const messageRef = collection(db, "chats", chatId, "messages");
    const now = new Date().toISOString();
  
    // 上傳圖片到 Firebase Storage
    const path = `chatImages/${chatId}/${Date.now()}_${file.name}`;
    const imageUrl = await uploadImage(file, path);
    if (!imageUrl) throw new Error("圖片上傳失敗");
  
    // 寫入訊息資料
    await addDoc(messageRef, {
      senderUid,
      type: "image",
      imageUrl,
      createdAt: now,
      readBy: [senderUid],
    });
  
    // 取得對方的 currentOpenChatId
    let recipientOpenChatId = null;
    try {
      const recipientDoc = await getDoc(doc(db, "users", recipientUid));
      if (recipientDoc.exists()) {
        recipientOpenChatId = recipientDoc.data().currentOpenChatId;
      }
    } catch (err) {
      console.error("讀取對方使用者資料失敗", err);
    }
  
    const isRecipientReading = recipientOpenChatId === chatId;
  
    // 更新聊天列表資訊
    const chatUpdateData = {
      lastMessage: "[圖片]",
      lastSender: senderUid,
      lastUpdated: now,
      [`unreadCounts.${senderUid}`]: 0,
    };
  
    if (!isRecipientReading) {
      chatUpdateData[`unreadCounts.${recipientUid}`] = increment(1);
    }
  
    await updateDoc(doc(db, "chats", chatId), chatUpdateData);
  }
  