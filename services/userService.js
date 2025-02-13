import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// 透過電子郵件取得使用者資料
export async function getUserByEmail(email) {
    
    console.log("email:", email);
   
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

   
  
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { uid: doc.id, ...doc.data() }; // 返回文档的 `uid` 和数据
    }
    return null;
  };



// 更新使用者驗證碼
export async function updateUserVerificationCode (uid, verificationCode , verificationCodeExpiresAt, email ,isEmailCodeVerified) {
  
  await updateDoc(doc(db, "users", uid), {
        verificationCode,
        email,
        verificationCodeExpiresAt,
        isEmailCodeVerified
    });
}


// 根據uid 取出使用者資料
export const getUserData = async (uid) =>{
    try{
      const userRef = doc(db, "users", uid);
      const userSnapshot = await getDoc(userRef);

      if(!userSnapshot.exists()){
         return {success: false, message: "找不到使用者資料"};
      }

      const { verificationCodeExpiresAt, ...userData } = userSnapshot.data();

      return {success: true, data: userData}; 
    }catch(error) {
      return {success: false, message: "發生錯誤，請稍後再試。" };
    }
}

// 更新使用者角色
export const updateUserRole = async (uid, role) => {
  try {
      const userRef = doc(db, "users", uid);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
          return { success: false, message: "用戶不存在，無法更新角色" };
      }

      await updateDoc(userRef, { role });

      return { success: true, message: "角色更新成功" };
  } catch (error) {
      
      return { success: false, message: "角色更新失敗，請稍後再試" };
  }
};


// 更新使用者資料
export const updateUserData = async (uid, data) => {
  try {
      const userRef = doc(db, "users", uid);
      
      await updateDoc(userRef, data); // 直接更新，減少一次讀取操作

      return { success: true, message: "資料更新成功" };
  } catch (error) {
      console.error("❌ 更新資料失敗：", error.message);
      return { success: false, message: `資料更新失敗：${error.message}` };
  }
};
