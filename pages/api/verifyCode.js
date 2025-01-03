import { getUserByEmail, updateUserVerificationCode } from "@/services/userService";



export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "只允許 POST 請求" });
    }

    const { email, verificationCode } = req.body;

    console.log(email, verificationCode);

    if (!email || !verificationCode) {
        return res.status(400).json({  message: "Missing required fields"  });
      }


     try {
        const userData = await getUserByEmail(email);

        if (!userData) {
        return res.status(400).json({ message: "使用者不存在" });
        }

       

        // 驗證驗證碼是否正確 以及 驗證碼是否過期
        if (
            userData.verificationCode == verificationCode &&
            new Date() <= userData.verificationCodeExpiresAt.toDate() // 驗證碼是否過期
          ) {


            // 刪除 verificationCode 和 verificationCodeExpiresAt
            await updateUserVerificationCode(userData.uid, null, null, email, true);

            return res.status(200).json({ message: "驗證成功 🎉: 即將跳轉至登入頁面" });
          }else{
            return res.status(400).json({ message: "驗證碼錯誤或已過期" });
          }
        } catch (error) {
         
            return res.status(500).json({ message: "伺服器錯誤" });
        }
}