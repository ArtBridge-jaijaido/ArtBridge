import { db } from "@/lib/firebase";
import { collectionGroup, onSnapshot, query, orderBy,getDocs } from "firebase/firestore";
import { store } from "@/app/redux/store";
import { 
    setLoading,
    setPainterPortfolios, 
    addPainterPortfolio, 
    updatePainterPortfolio, 
    deletePainterPortfolio 
} from "@/app/redux/feature/painterPortfolioSlice";
import { getUserData } from "@/services/userService";
const userCache = {};

export const subscribeToPainterPortfolios = () => {
  const portfoliosQuery = query(
    collectionGroup(db, "portfolios"),
    orderBy("createdAt", "asc"),
    orderBy("portfolioId", "asc")
  );

  let isInitialLoad = true;
  store.dispatch(setLoading(true));

  const unsubscribe = onSnapshot(portfoliosQuery, async (querySnapshot) => {
    const portfolios = [];

    for (const change of querySnapshot.docChanges()) {
      const portfolioData = { id: change.doc.id, ...change.doc.data() };
      const userUid = portfolioData.userUid;

      //  轉換 Timestamp
      if (portfolioData.createdAt?.toDate) {
        portfolioData.createdAt = portfolioData.createdAt.toDate().toISOString();
      }

      //  拉取使用者資料（使用快取避免重複請求）
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
          console.error("抓取使用者資料失敗：", error);
          userCache[userUid] = {
            profileAvatar: "/images/kv-min-4.png",
            nickname: "使用者名稱",
          };
        }
      }

      //  整合 user 資料
      portfolioData.artistProfileImg = userCache[userUid].profileAvatar;
      portfolioData.artistNickName = userCache[userUid].nickname;

      if (isInitialLoad) {
        portfolios.push(portfolioData);
      } else {
        switch (change.type) {
          case "modified":
            store.dispatch(updatePainterPortfolio(portfolioData));
            break;
          default:
            console.warn(`⚠️ Unhandled change type: ${change.type}`);
        }
      }
    }

    if (isInitialLoad) {
      store.dispatch(setPainterPortfolios(portfolios));
      isInitialLoad = false;
    }

    store.dispatch(setLoading(false));
  });

  return unsubscribe;
};

export const fetchPainterPortfolios = async () => {
    store.dispatch(setLoading(true));

    try {
        const portfoliosQuery = query(
            collectionGroup(db, "portfolios"),
            orderBy("createdAt", "asc"),
            orderBy("portfolioId", "asc")
        );

        const querySnapshot = await getDocs(portfoliosQuery);
        const portfolios = [];

        querySnapshot.forEach((doc) => {
            let portfolioData = { id: doc.id, ...doc.data() };

            if (portfolioData.createdAt?.toDate) {
                portfolioData.createdAt = portfolioData.createdAt.toDate().toISOString();
            }

            portfolios.push(portfolioData);
        });

        store.dispatch(setPainterPortfolios(portfolios));
    } catch (error) {
        console.error("Error fetching portfolios:", error);
    } finally {
        store.dispatch(setLoading(false));
    }
};