import { db } from "@/lib/firebase";
import { collectionGroup, onSnapshot, query, orderBy, getDocs } from "firebase/firestore";
import { store } from "@/app/redux/store";
import {
  setEntrustPortfolioLoading,
  setEntrustPortfolios,
  updateEntrustPortfolio
} from "@/app/redux/feature/entrustPortfolioSlice";
import { getUserData } from "@/services/userService";

const userCache = {};

export const subscribeToEntrustPortfolios = () => {
  const portfoliosQuery = query(
    collectionGroup(db, "portfolios"),
    orderBy("createdAt", "asc"),
    orderBy("portfolioId", "asc")
  );

  let isInitialLoad = true;
  store.dispatch(setEntrustPortfolioLoading(true));

  const unsubscribe = onSnapshot(portfoliosQuery, async (querySnapshot) => {
    const portfolios = [];

    for (const change of querySnapshot.docChanges()) {
      const data = { id: change.doc.id, ...change.doc.data() };
      const userUid = data.userUid;

      if (data.createdAt?.toDate) {
        data.createdAt = data.createdAt.toDate().toISOString();
      }

      if (!userCache[userUid]) {
        try {
          const res = await getUserData(userUid);
          userCache[userUid] = res.success ? res.data : {
            nickname: "使用者名稱",
            profileAvatar: "/images/default.png",
          };
        } catch {
          userCache[userUid] = {
            nickname: "使用者名稱",
            profileAvatar: "/images/default.png",
          };
        }
      }

      data.artistNickName = userCache[userUid].nickname;
      data.artistProfileImg = userCache[userUid].profileAvatar;

      if (isInitialLoad) {
        portfolios.push(data);
      } else {
        if (change.type === "modified") {
          store.dispatch(updateEntrustPortfolio(data));
        }
      }
    }

    if (isInitialLoad) {
      store.dispatch(setEntrustPortfolios(portfolios));
      isInitialLoad = false;
    }

    store.dispatch(setEntrustPortfolioLoading(false));
  });

  return unsubscribe;
};

export const fetchEntrustPortfolios = async () => {
  store.dispatch(setEntrustPortfolioLoading(true));

  try {
    const portfoliosQuery = query(
      collectionGroup(db, "portfolios"),
      orderBy("createdAt", "asc"),
      orderBy("portfolioId", "asc")
    );

    const querySnapshot = await getDocs(portfoliosQuery);
    const portfolios = [];

    for (const doc of querySnapshot.docs) {
      let data = { id: doc.id, ...doc.data() };

      if (data.createdAt?.toDate) {
        data.createdAt = data.createdAt.toDate().toISOString();
      }

      const userUid = data.userUid;

      if (!userCache[userUid]) {
        try {
          const res = await getUserData(userUid);
          userCache[userUid] = res.success ? res.data : {
            nickname: "使用者名稱",
            profileAvatar: "/images/default.png",
          };
        } catch {
          userCache[userUid] = {
            nickname: "使用者名稱",
            profileAvatar: "/images/default.png",
          };
        }
      }

      data.artistNickName = userCache[userUid].nickname;
      data.artistProfileImg = userCache[userUid].profileAvatar;

      portfolios.push(data);
    }

    store.dispatch(setEntrustPortfolios(portfolios));
  } catch (error) {
    console.error("Error fetching entrust portfolios:", error);
  } finally {
    store.dispatch(setEntrustPortfolioLoading(false));
  }
};
