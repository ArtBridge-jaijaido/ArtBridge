import { db } from "@/lib/firebase";
import {
  collectionGroup,
  onSnapshot,
  query,
  orderBy,
  getDocs
} from "firebase/firestore";
import { store } from "@/app/redux/store";
import {
  setEntrusts,
  updateEntrust
} from "@/app/redux/feature/entrustSlice";

export const subscribeToEntrusts = () => {
  const entrustsQuery = query(
    collectionGroup(db, "entrusts"),
    orderBy("createdAt", "asc"),
    orderBy("marketName", "asc")
  );

  let isInitialLoad = true;

  const unsubscribe = onSnapshot(entrustsQuery, async (querySnapshot) => {
    const entrusts = [];

    for (const change of querySnapshot.docChanges()) {
      const entrustData = { entrustId: change.doc.id, ...change.doc.data() };

      if (entrustData.createdAt?.toDate) {
        entrustData.createdAt = entrustData.createdAt.toDate().toISOString();
      }

      if (isInitialLoad) {
        entrusts.push(entrustData);
      } else {
        switch (change.type) {
          case "modified":
            store.dispatch(updateEntrust(entrustData));
            break;
          default:
            console.warn(`Unhandled change type: ${change.type}`);
        }
      }
    }

    if (isInitialLoad) {
      store.dispatch(setEntrusts(entrusts));
      isInitialLoad = false;
    }
  });

  return unsubscribe;
};


export const fetchAllEntrusts = async () => {
    try {
      const entrustsQuery = query(
        collectionGroup(db, "entrusts"),
        orderBy("createdAt", "asc"),
        orderBy("marketName", "asc")
      );
  
      const querySnapshot = await getDocs(entrustsQuery);
      const entrusts = [];
  
      for (const doc of querySnapshot.docs) {
        let entrustData = { entrustId: doc.id, ...doc.data() };
  
        if (entrustData.createdAt?.toDate) {
          entrustData.createdAt = entrustData.createdAt.toDate().toISOString();
        }
  
        entrusts.push(entrustData);
      }
  
      store.dispatch(setEntrusts(entrusts));
    } catch (error) {
      console.error("Error fetching entrusts:", error);
    }
  };
  