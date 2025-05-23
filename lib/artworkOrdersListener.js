import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { store } from "@/app/redux/store";
import {
  setConsumerOrders,
  addConsumerOrder,
  updateConsumerOrder,
  setPainterOrders,
  addPainterOrder,
  updatePainterOrder,
} from "@/app/redux/feature/artworkOrderSlice";

/**
 * 訂閱目前登入使用者（委託方）擁有的案件
 */
export const subscribeToConsumerOrders = (userUid) => {
  if (!userUid) {

    return () => { };
  }

  let unsub = () => { };
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
                store.dispatch(updateConsumerOrder(orderData));
                break;
              default:
                console.warn(" Unhandled change:", change.type);
            }
          }
        }

        if (isInitialLoad) {
          store.dispatch(setConsumerOrders(orders));
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
    return () => { };
  }
};


/**
 * 訂閱目前登入使用者（畫師）被指派的案件
 */
export const subscribeToPainterOrders = (userUid) => {
  if (!userUid) return () => { };

  let unsub = () => { };
  try {
    const q = query(
      collection(db, "artworkOrders"),
      where("assignedPainterUid", "==", userUid),
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

            console.log("訂單變更:", change.type);

            switch (change.type) {

              case "added":
                store.dispatch(addPainterOrder(orderData));
                break;



              case "modified":
               
                  store.dispatch(updatePainterOrder(orderData));
               
                break;
              default:
                console.warn("Unhandled change:", change.type);
            }
          }
        }

        if (isInitialLoad) {
          store.dispatch(setPainterOrders(orders));
          isInitialLoad = false;
        }
      },
      (error) => {
        if (error.code === "permission-denied") {
          // 靜默處理
        }
      }
    );

    return unsub;
  } catch (error) {
    console.error("建立畫師訂閱失敗:", error.message);
    return () => { };
  }
};
