import { db } from "@/lib/firebase";
import { collectionGroup, onSnapshot, query, orderBy } from "firebase/firestore";
import { store } from "@/app/redux/store";
import { 
    setLoading,
    setPainterArticles, 
    addPainterArticle, 
    updatePainterArticle, 
    deletePainterArticle 
} from "@/app/redux/feature/painterArticleSlice";



export const subscribeToPainterArticles=()=>{
    const articlesQuery = query(
        collectionGroup(db, "articles"),
        orderBy("createdAt", "asc"),
        orderBy("articleId", "asc")
    );

    let isInitialLoad = true;
    store.dispatch(setLoading(true));

    const unsubscribe = onSnapshot(articlesQuery, (querySnapshot) => {
        const articles = [];

        querySnapshot.docChanges().forEach((change) => {
            const articleData = { id: change.doc.id, ...change.doc.data() };

            // ✅ 轉換 Timestamp
            if (articleData.createdAt?.toDate) {
                articleData.createdAt = articleData.createdAt.toDate().toISOString();
            }

            if (isInitialLoad) { // **初次載入時，存入 Redux**
                articles.push(articleData);
            } else {
                switch (change.type) {
                    case "added":
                        store.dispatch(addPainterArticle(articleData));
                        break;
                    case "modified":
                        store.dispatch(updatePainterArticle(articleData));
                        break;
                    case "removed":
                        store.dispatch(deletePainterArticle(articleData.articleId));
                        break;
                    default:
                        console.warn(`⚠️ Unhandled change type: ${change.type}`);
                }
            }
        });

        if (isInitialLoad) {
            store.dispatch(setPainterArticles(articles)); // **將初次載入的資料推送到 Redux**
            isInitialLoad = false;
        }
        store.dispatch(setLoading(false));
    });

    return unsubscribe;
}

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
        querySnapshot.forEach((doc) => {
            let articleData = {id: doc.id, ...doc.data()};
            if (articleData.createdAt?.toDate) {
                articleData.createdAt = articleData.createdAt.toDate().toISOString();
            }
            articles.push(articleData);
        });

        store.dispatch(setPainterArticles(articles));
    } catch (error) {
        console.error("Error fetching articles", error);
    }finally{
        store.dispatch(setLoading(false));
    }
};