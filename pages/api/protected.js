import { adminAuth } from "@/lib/firebaseAdmin";
import cookie from "cookie";

export default async function handler(req, res) {
    try {
        const cookies = cookie.parse(req.headers.cookie || ""); 
        const token = cookies.token; 

  
        if (!token) {
            return res.status(401).json({ message: "未授權，請重新登入" });
        }

       
        const decodedToken = await adminAuth.verifyIdToken(token);
        return res.status(200).json({ message: "已驗證", user: decodedToken });
    } catch (error) {
        console.error("Token 驗證失敗:", error);
        return res.status(401).json({ message: "Token 無效，請重新登入" });
    }
}
