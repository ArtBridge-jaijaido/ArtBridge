// services/articleCommentService.js
import {
    collection,
    query,
    orderBy,
    addDoc,
    serverTimestamp,
    onSnapshot
  } from "firebase/firestore";
  import { db } from "@/lib/firebase"; // 你的 firebase 初始化檔案
  
  /**
   * 新增一則留言
   */
  export const addComment = async (userUid, articleId, commentData) => {
    if (!userUid || !articleId || !commentData.content) return;
  
    const commentRef = collection(db, "artworkArticle", userUid, "articles", articleId, "comments");
  
    await addDoc(commentRef, {
      ...commentData,
      createdAt: serverTimestamp(),
      likes: 0,         // 預設按讚數
      reported: false,  // 是否被檢舉
    });
  };
  
  
  /**
   * 即時監聽留言
   */
  export const subscribeToComments = (userUid, articleId, callback) => {
    const q = query(
      collection(db, `artworkArticle/${userUid}/articles/${articleId}/comments`),
      orderBy("createdAt", "desc")
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(comments);
    });
  
    return unsubscribe; 
  };
  