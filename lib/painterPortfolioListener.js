import { db } from "@/lib/firebase";
import { collectionGroup, onSnapshot, query, orderBy } from "firebase/firestore";
import { store } from "@/app/redux/store";
import { 
    setLoading,
    setPainterPortfolios, 
    addPainterPortfolio, 
    updatePainterPortfolio, 
    deletePainterPortfolio 
} from "@/app/redux/feature/painterPortfolioSlice";

export const subscribeToPainterPortfolios = () => {
    const portfoliosQuery = query(
        collectionGroup(db, "portfolios"),
        orderBy("createdAt", "asc"),
        orderBy("portfolioId", "asc")
    );

    let isInitialLoad = true;
    store.dispatch(setLoading(true));

    const unsubscribe = onSnapshot(portfoliosQuery, (querySnapshot) => {
        const portfolios = [];

        querySnapshot.docChanges().forEach((change) => {
            const portfolioData = { id: change.doc.id, ...change.doc.data() };

            // ✅ 轉換 Timestamp
            if (portfolioData.createdAt?.toDate) {
                portfolioData.createdAt = portfolioData.createdAt.toDate().toISOString();
            }

            if (isInitialLoad) { // **初次載入時，存入 Redux**
                portfolios.push(portfolioData);
            } else {
                switch (change.type) {
                    case "added":
                        store.dispatch(addPainterPortfolio(portfolioData));
                        break;
                    case "modified":
                        store.dispatch(updatePainterPortfolio(portfolioData));
                        break;
                    case "removed":
                        store.dispatch(deletePainterPortfolio(portfolioData.portfolioId));
                       
                        break;
                    default:
                        console.warn(`⚠️ Unhandled change type: ${change.type}`);
                }
            }
        });

        if (isInitialLoad) {
         
            store.dispatch(setPainterPortfolios(portfolios)); // **將初次載入的資料推送到 Redux**
           
            isInitialLoad = false;
        }
        store.dispatch(setLoading(false));
    });

    return unsubscribe;
};
