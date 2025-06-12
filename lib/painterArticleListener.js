import { db } from "@/lib/firebase";
import { collectionGroup, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { store } from "@/app/redux/store";
import {
  setLoading,
  setPainterArticles,
  addPainterArticle,
  updatePainterArticle,
  deletePainterArticle
} from "@/app/redux/feature/painterArticleSlice";


import { getUserData } from "@/services/userService";

export const subscribeToPainterArticles = () => {
  const articlesQuery = query(
    collectionGroup(db, "articles"),
    orderBy("createdAt", "asc"),
    orderBy("articleId", "asc")
  );

  let isInitialLoad = true;
  store.dispatch(setLoading(true));

  const userCache = {};

  const unsubscribe = onSnapshot(articlesQuery, async (querySnapshot) => {
    const articles = [];

    for (const change of querySnapshot.docChanges()) {
      const articleData = { id: change.doc.id, ...change.doc.data() };
      const userUid = articleData.userUid;

      //  等待 user 資料
      if (!userCache[userUid]) {
        try {
          const userResponse = await getUserData(userUid);
          if (userResponse.success) {
            userCache[userUid] = userResponse.data;
          } else {
            userCache[userUid] = {
              profileAvatar: "/images/kv-min-4.png",
              nickname: "使用者名稱",
            };
          }
        } catch (error) {
          console.error("取得使用者資料失敗", error);
          userCache[userUid] = {
            profileAvatar: "/images/kv-min-4.png",
            nickname: "使用者名稱",
          };
        }
      }

      //  合併使用者資訊
      articleData.artistProfileImg = userCache[userUid].profileAvatar;
      articleData.artistNickName = userCache[userUid].nickname;

      //  轉換時間
      if (articleData.createdAt?.toDate) {
        articleData.createdAt = articleData.createdAt.toDate().toISOString();
      }

      if (isInitialLoad) {
        articles.push(articleData);
      } else {
        switch (change.type) {
          case "modified":

            store.dispatch(updatePainterArticle(articleData));
          default:
            console.warn(`⚠️ Unhandled change type: ${change.type}`);
        }
      }
    }

    if (isInitialLoad) {
      store.dispatch(setPainterArticles(articles));
      isInitialLoad = false;
    }

    store.dispatch(setLoading(false));
  });

  return unsubscribe;
};

export const fetchPainterArticles = async () => {
  store.dispatch(setLoading(true));

  try {
    const articlesQuery = query(
      collectionGroup(db, "articles"),
      orderBy("createdAt", "asc"),
      orderBy("articleId", "asc")
    );

    const querySnapshot = await getDocs(articlesQuery);
    const articles = [];
    const userCache = {};

    for (const doc of querySnapshot.docs) {
      let articleData = { id: doc.id, ...doc.data() };
      const userUid = articleData.userUid;

      //  加入 user 資料
      if (!userCache[userUid]) {
        const userResponse = await getUserData(userUid);
        if (userResponse.success) {
          userCache[userUid] = userResponse.data;
        } else {
          userCache[userUid] = {
            profileAvatar: "/images/kv-min-4.png",
            nickname: "使用者名稱",
          };
        }
      }

      articleData.artistProfileImg = userCache[userUid].profileAvatar;
      articleData.artistNickName = userCache[userUid].nickname;

      //  轉換 timestamp
      if (articleData.createdAt?.toDate) {
        articleData.createdAt = articleData.createdAt.toDate().toISOString();
      }

      articles.push(articleData);
    }

    store.dispatch(setPainterArticles(articles));
  } catch (error) {
    console.error("Error fetching articles", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};




