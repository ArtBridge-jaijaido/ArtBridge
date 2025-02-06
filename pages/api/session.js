import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const token = req.headers.authorization?.split(" ")[1]; // 從 `Authorization` 頭部取得 token

    if (!token) {
      return res.status(401).json({ message: "未提供身份驗證 token" });
    }

    try {
      // 驗證 ID Token
      const decodedToken = await adminAuth.verifyIdToken(token);
      const uid = decodedToken.uid;

      // 從 Firestore 取得用戶資訊
      const userRef = adminDb.collection("users").doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ message: "找不到使用者資料" });
      }

      const userData = userDoc.data();
      return res.status(200).json({ user: { uid, ...userData } });
    } catch (error) {
      return res.status(401).json({ message: "無效的身份驗證 token" });
    }
  } else {
    res.status(405).json({ message: "只允許 GET 請求" });
  }
}
