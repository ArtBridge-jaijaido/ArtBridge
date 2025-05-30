// services/articleCommentService.js
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  deleteDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  doc,
  getDoc,
  updateDoc,
  getCountFromServer
} from "firebase/firestore";

import { db } from "@/lib/firebase";


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
    likedBy: [],      // 按讚的使用者
    reportedBy: [] ,  // 檢舉的使用者
  });
};

/**
 * toggle like
 */
export const toggleCommentLike = async (userUid,articleId, commentId, currentUserUid) => {
  if (!userUid || !articleId || !commentId || !currentUserUid) return;

  const commentRef = doc(db, "artworkArticle", userUid, "articles", articleId, "comments", commentId);
  const snapshot = await getDoc(commentRef);

  if (!snapshot.exists()) {
    console.log("comment not found");
    return;
  }

  const commentData = snapshot.data();
  const hasLiked = commentData.likedBy?.includes(currentUserUid);

  if (hasLiked) {
    await updateDoc(commentRef, {
      likes: commentData.likes - 1,
      likedBy: arrayRemove(currentUserUid),
    });
  }else{
    await updateDoc(commentRef, {
      likes: commentData.likes + 1,
      likedBy: arrayUnion(currentUserUid),
    });
  }
  
}

/**
 * report comment 
 */
export const toggleCommentReport = async (userUid, articleId, commentId, currentUserUid) => {
  if (!userUid || !articleId || !commentId || !currentUserUid) return;
  const commentRef = doc(db, "artworkArticle", userUid, "articles", articleId, "comments", commentId);
  const snapshot = await getDoc(commentRef);

  if (!snapshot.exists()) {
    console.log("comment not found");
    return;
  }

  const commentData = snapshot.data();
  const hasReported = commentData.reportedBy?.includes(currentUserUid);

  if (hasReported) {
    await updateDoc(commentRef, {
      reportedBy: arrayRemove(currentUserUid),
    });
  } else {
    await updateDoc(commentRef, {
      reportedBy: arrayUnion(currentUserUid),
    });
  }

};



/**
 * total comments number single article
 */
export const getCommentCount = async (userUid, articleId) => {
  if (!userUid || !articleId) return 0;

  const commentRef = collection(db, "artworkArticle", userUid, "articles", articleId, "comments");
  const snapshot = await getCountFromServer(commentRef);

  return snapshot.data().count;
};


/**
 * 取得每一篇article的留言數
 */
export const getAllCommentCounts = async (articles) => {
  const results = {};

  await Promise.all(
    articles.map(async (article) => {
      const ref = collection(db, "artworkArticle", article.userUid, "articles", article.articleId, "comments");
      const snapshot = await getCountFromServer(ref);
      results[article.articleId] = snapshot.data().count;
    })
  );

  return results;
};



/**
 * 即時監聽留言、愛心狀態
 */
export const subscribeToComments = (userUid, articleId, callback, currentUserUid) => {
  const q = query(
    collection(db, `artworkArticle/${userUid}/articles/${articleId}/comments`),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const commentId = docSnap.id;

      const isLikedByCurrentUser = currentUserUid
        ? data.likedBy?.includes(currentUserUid)
        : false;

      const isReportedByCurrentUser = currentUserUid
        ? data.reportedBy?.includes(currentUserUid)
        : false;

      return {
        id: commentId,
        ...data,
        isLikedByCurrentUser,
        isReportedByCurrentUser
      };
    });

    callback(comments);
    
  });

  return unsubscribe;
};

/**
 * 刪除留言
 */

export const deleteComment = async (userUid, articleId, commentId) => {
  if (!userUid || !articleId || !commentId) return;

  try {
    const commentRef = doc(db, "artworkArticle", userUid, "articles", articleId, "comments", commentId);
    await deleteDoc(commentRef);
    return { success: true };
  } catch (error) {
    console.error("刪除留言失敗", error);
    return { success: false, error };
  }
};