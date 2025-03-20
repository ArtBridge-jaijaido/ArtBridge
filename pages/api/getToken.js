import cookie from "cookie";

export default async function handler(req, res) {
    try {
        const cookies = cookie.parse(req.headers.cookie || "");
        const token = cookies.token || null; // 從 HttpOnly Cookie 讀取 token

        if (!token) {
            return res.status(401).json({ message: "未授權，請重新登入" });
        }

        return res.status(200).json({ token });
    } catch (error) {
        console.error("獲取 token 失敗:", error);
        return res.status(500).json({ message: "伺服器錯誤" });
    }
}
