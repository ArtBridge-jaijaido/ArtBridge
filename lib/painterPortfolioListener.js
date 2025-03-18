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

                    case "modified":
                        console.log("user modified")
                        store.dispatch(updatePainterPortfolio(portfolioData));
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