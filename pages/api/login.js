// pages/api/login.js
import { adminAuth, adminDb  } from '@/lib/firebaseAdmin';
const cookie = require('cookie');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const token = req.headers.authorization?.split(' ')[1]; // 從 `Authorization` 頭部取得 token
        const { rememberMe } = req.body || {};

        if (!token) {
            return res.status(401).json({ message: '未提供身份驗證 token' });
        }

       

        try {
            // 驗證 ID Token
            const decodedToken = await adminAuth.verifyIdToken(token); // 驗證 token
            const uid = decodedToken.uid; // 取得使用者 ID

            // 從 Firestore 中取得使用者資料
            const userRef = adminDb.collection("users").doc(uid); // 取得使用者文件參考
            const userDoc = await userRef.get(); // 取得使用者文件

            // 確認文件是否存在
            if (!userDoc.exists) {
                return res.status(404).json({ message: '找不到使用者資料' });
            }

            const userData = userDoc.data();

            // 設置 HttpOnly Cookie，將 token 存儲在 cookie 中
            res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                httpOnly: true, // 設置為 httpOnly，增加安全性
                maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined,
                sameSite: 'Lax',  // 避免 CSRF 攻擊
                path: '/',
            }));

            return res.status(200).json({ message: '驗證成功', user: { uid, ...userData } }); // 回傳使用者資料
        } catch (error) {
            console.error("Error verifying token:", error);

            // 如果驗證失敗，回傳 401
            return res.status(401).json({ message: '無效的身份驗證 token', error: error.message });
        }
    } else {
        res.status(405).json({ message: '只允許 POST 請求' });
    }
}
