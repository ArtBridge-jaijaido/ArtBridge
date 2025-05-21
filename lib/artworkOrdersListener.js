import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { store } from "@/app/redux/store";
import {
  setArtworkOrders,
  updateArtworkOrder,
} from "@/app/redux/feature/artworkOrderSlice";

/**
 * 訂閱目前登入使用者（委託方）擁有的案件
 */
export const subscribeToConsumerOrders = (userUid) => {
  if (!userUid) {
   
    return () => {};
  }

  let unsub = () => {};
  try {
    const q = query(
      collection(db, "artworkOrders"),
      where("userUid", "==", userUid),
      orderBy("createdAt", "asc")
    );

    let isInitialLoad = true;

    unsub = onSnapshot(
      q,
      (snapshot) => {
        const orders = [];

        for (const change of snapshot.docChanges()) {
          const orderData = { id: change.doc.id, ...change.doc.data() };

          if (orderData.createdAt?.toDate) {
            orderData.createdAt = orderData.createdAt.toDate().toISOString();
          }

          if (isInitialLoad) {
            orders.push(orderData);
          } else {
            switch (change.type) {
              case "modified":
                store.dispatch(updateArtworkOrder(orderData));
                break;
              default:
                console.warn(" Unhandled change:", change.type);
            }
          }
        }

        if (isInitialLoad) {
          store.dispatch(setArtworkOrders(orders));
          isInitialLoad = false;
        }
      },
      (error) => {
        if (error.code === "permission-denied") {
            // 靜默處理，不報錯也不顯示
          }
      }
    );

    return unsub;
  } catch (error) {
    console.error(" 建立 artworkOrders 訂閱失敗:", error.message);
    return () => {};
  }
};
