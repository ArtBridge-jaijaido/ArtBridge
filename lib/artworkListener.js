// lib/artworkListener.js
import { db } from "@/lib/firebase";
import { collectionGroup, onSnapshot, query, orderBy,getDocs } from "firebase/firestore";
import { store } from "@/app/redux/store";
import { setArtworks, addArtwork, updateArtwork, deleteArtwork } from "@/app/redux/feature/artworkSlice";


export const subscribeToArtworks = () => {
    const artworksQuery = query(
      collectionGroup(db, "artworks"),
      orderBy("createdAt", "asc"),
      orderBy("marketName", "asc")
    );
  
    let isInitialLoad = true;
  
    const unsubscribe = onSnapshot(artworksQuery, async (querySnapshot) => {
      const artworks = [];
  
      for (const change of querySnapshot.docChanges()) {
        const artworkData = { id: change.doc.id, ...change.doc.data() };
  
        if (artworkData.createdAt?.toDate) {
          artworkData.createdAt = artworkData.createdAt.toDate().toISOString();
        }
  
        if (isInitialLoad) {
          artworks.push(artworkData);
        } else {
          switch (change.type) {
            case "modified":
              store.dispatch(updateArtwork(artworkData));
              break;
            default:
              console.warn(`Unhandled change type: ${change.type}`);
          }
        }
      }
  
      if (isInitialLoad) {
        store.dispatch(setArtworks(artworks));
        isInitialLoad = false;
      }
    });
  
    return unsubscribe;
  };

  export const fetchPainterArtwork = async () => {
    try {
      const artworksQuery = query(
        collectionGroup(db, "artworks"),
        orderBy("createdAt", "asc"),
        orderBy("marketName", "asc")
      );
  
      const querySnapshot = await getDocs(artworksQuery);
      const artworks = [];
  
      for (const doc of querySnapshot.docs) {
        let artworkData = { id: doc.id, ...doc.data() };
  
        // ✅ 轉換時間格式
        if (artworkData.createdAt?.toDate) {
          artworkData.createdAt = artworkData.createdAt.toDate().toISOString();
        }
  
        // ✅ 只留下基本資料，畫面再去從 allUsers 拿頭貼 & 暱稱
        artworks.push(artworkData);
      }
  
      store.dispatch(setArtworks(artworks));
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };


  // export const subscribeToArtworks = () => {
//     const artworksQuery = query(
//         collectionGroup(db, "artworks"),
//         orderBy("createdAt", "asc"),
//         orderBy("marketName", "asc")
//     );

//     let isInitialLoad = true;
//     const userCache = {}; // 用來緩存已經請求過的 user data，避免重複請求

//     const unsubscribe = onSnapshot(artworksQuery, async (querySnapshot) => {
//         const artworks = [];

//         // 使用 for...of 支援 async/await
//         for (const change of querySnapshot.docChanges()) {
//             const artworkData = { id: change.doc.id, ...change.doc.data() };
//             const userUid = artworkData.userUid;

//             // ✅ 檢查 cache 避免重複請求
//             if (!userCache[userUid]) {
//                 const userResponse = await getUserData(userUid);
//                 if (userResponse.success) {
//                     userCache[userUid] = userResponse.data;
//                 } else {
//                     userCache[userUid] = { profileAvatar: "/images/kv-min-4.png", nickname: "使用者名稱" };
//                 }
//             }

//             // ✅ 將 user 資料整合進 artwork
//             artworkData.artistProfileImg = userCache[userUid].profileAvatar;
//             artworkData.artistNickName = userCache[userUid].nickname;

//             // 轉換 Timestamp
//             if (artworkData.createdAt?.toDate) {
//                 artworkData.createdAt = artworkData.createdAt.toDate().toISOString();
//             }

//             if (isInitialLoad) { // 初次載入時，將資料存入 redux
//                 artworks.push(artworkData);
//             } else {
//                 switch (change.type) {
//                     // case "added":
//                     //     store.dispatch(addArtwork(artworkData));
//                     //     break;
//                     case "modified":
//                         store.dispatch(updateArtwork(artworkData));
//                         break;
//                     // case "removed":
//                     //     store.dispatch(deleteArtwork(artworkData.artworkId));
//                     //     break;
//                     default:
//                         console.warn(`Unhandled change type: ${change.type}`);
//                 }
//             }
//         }

//         if (isInitialLoad) {
//             store.dispatch(setArtworks(artworks));
//             isInitialLoad = false;
//         }


//     });

//     return unsubscribe;
// };

  

// export const fetchPainterArtwork = async () => {
//     try {
//         const artworksQuery = query(
//             collectionGroup(db, "artworks"),
//             orderBy("createdAt", "asc"),
//             orderBy("marketName", "asc")
//         );

//         const querySnapshot = await getDocs(artworksQuery);
//         const artworks = [];
//         const userCache = {};
//         for (const doc of querySnapshot.docs) {
//             let artworkData = { id: doc.id, ...doc.data() };
//             const userUid = artworkData.userUid;

//             // ✅ 加入 user 資料
//             if (!userCache[userUid]) {
//                 const userResponse = await getUserData(userUid);
//                 if (userResponse.success) {
//                     userCache[userUid] = userResponse.data;
//                 } else {
//                     userCache[userUid] = { profileAvatar: "/images/kv-min-4.png", nickname: "使用者名稱" };
//                 }
//             }

//             // ✅ 整合 user 資料
//             artworkData.artistProfileImg = userCache[userUid].profileAvatar;
//             artworkData.artistNickName = userCache[userUid].nickname;

//             // ✅ 轉換時間
//             if (artworkData.createdAt?.toDate) {
//                 artworkData.createdAt = artworkData.createdAt.toDate().toISOString();
//             }

//             artworks.push(artworkData);
//         } 
//         store.dispatch(setArtworks(artworks));
//     } catch (error) {
//         console.error("Error fetching artworks:", error);
//     }
// }


