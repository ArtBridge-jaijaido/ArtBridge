const cookie = require('cookie');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // 清除 'token' Cookie
            res.setHeader('Set-Cookie', cookie.serialize('token', '', {
                httpOnly: true,
                sameSite: 'strict', 
                path: '/', 
                maxAge: 0, 
               
            }));

            return res.status(200).json({ message: '登出成功' });
        } catch (error) {
            console.error("登出失敗:", error);
            return res.status(500).json({ message: '登出失敗，請稍後再試' });
        }
    } else {
        return res.status(405).json({ message: '只允許 POST 請求' });
    }
}
