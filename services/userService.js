import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc,updateDoc } from "firebase/firestore";

// 透過電子郵件取得使用者資料
export async function getUserByEmail(email) {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { uid: doc.id, ...doc.data() }; // 返回文档的 `uid` 和数据
    }
    return null;
  };


// 更新使用者驗證碼

export async function updateUserVerificationCode (uid, verificationCode , verificationCodeExpiresAt, email, isEmailCodeVerified ) {
    await updateDoc(doc(db, "users", uid), {
        verificationCode,
        verificationCodeExpiresAt,
        email,
        isEmailCodeVerified,
    });
}
