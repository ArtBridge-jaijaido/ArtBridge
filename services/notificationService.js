// services/notificationService.js

import { collection, getDoc, doc, updateDoc, query,
  where, orderBy, getDocs, setDoc, addDoc, serverTimestamp} from 'firebase/firestore'
import { db } from '../lib/firebase'

// 新增：當使用者留言時觸發通知
export async function triggerNotificationOnComment({ targetUserId, commenterUid, articleId, commentContent }) {
  try {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
    const commentID = `comment-${commenterUid}-${timestamp}`;

    const payload = {
      userId: targetUserId,
      type: "personal",
      category: "comment",
      message: `你收到了一則新留言：「${commentContent.slice(0, 20)}...」`,
      relatedUserId: commenterUid,
      relatedItemId: articleId,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, "artworkNotifications", commentID), payload);
    console.log("留言通知已推送");
  } catch (error) {
    console.error("推送留言通知失敗", error);
  }
}

// 新增：當繪師應徵委託時觸發通知 
export async function triggerNotificationOnApply({ targetUserId, artistUid, entrustTitle, entrustId }) {
  try {
    // 1. 取得繪師的 nickname 與 userSerialId
    const artistRef = doc(db, 'users', artistUid)
    const artistSnap = await getDoc(artistRef)

    if (!artistSnap.exists()) {
      console.error('找不到該繪師的使用者資料')
      return
    }

    const artistData = artistSnap.data()
    const nickname = artistData.nickname || '未知繪師'

    // 2. 組出 message
    const message = `繪師 （${nickname}）應徵您的委託 - ${entrustTitle}，請至案件管理區查看詳細資訊`

    // 3. 用時間與亂數產生唯一 ID
    const now = new Date()
    const pad = (n) => n.toString().padStart(2, '0')
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
    const applyID = `apply-${artistUid}-${timestamp}`

    // 4. 寫入通知
    const payload = {
      userId: targetUserId,
      type: 'personal',
      category: 'apply',
      message,
      relatedUserId: artistUid,
      relatedItemId: entrustId,
      isRead: false,
      createdAt: new Date().toISOString() 
    };
    
    await setDoc(doc(db, 'artworkNotifications', applyID), payload);
    console.log(" 通知成功寫入 Firestore");

    console.log('成功發出應徵通知')
  } catch (error) {
    console.error('triggerNotificationOnApply 發生錯誤：', error)
  }
}



//  新增：標記單一通知為已讀
export async function markNotificationAsRead(id) {
  try {
    await updateDoc(doc(db, "artworkNotifications", id), {
      isRead: true
    });
  } catch (error) {
    console.error("無法更新通知為已讀：", error);
  }
}

//  新增：一鍵標記多筆通知為已讀
export async function markNotificationsAsReadBulk(ids = []) {
  try {
    await Promise.all(
      ids.map(id =>
        updateDoc(doc(db, "artworkNotifications", id), {
          isRead: true
        })
      )
    );
  } catch (error) {
    console.error("一鍵標記為已讀失敗：", error);
  }
}

//  依 userId 與 type 抓通知
export async function fetchNotificationsFromFirestore(userId, type) {
  let q;

  if (type === "personal") {
    q = query(
      collection(db, "artworkNotifications"),
      where("userId", "==", userId),
      where("type", "==", "personal"),
      orderBy("createdAt", "desc")
    );
  } else {
    q = query(
      collection(db, "artworkNotifications"),
      where("type", "==", "system"),
      orderBy("createdAt", "desc")
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
