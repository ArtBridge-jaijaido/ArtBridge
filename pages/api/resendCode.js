import { getUserByEmail,updateUserVerificationCode} from "@/services/userService";

import nodemailer from "nodemailer";


export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "只允許 POST 請求" });
      }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({  message: "Missing required fields"  });
    }


    try{
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 
       
        const userData = await getUserByEmail(email);
      

        if (!userData) {
            return res.status(400).json({ message: "使用者不存在" });
        }
       

        // 更新驗證碼
        await updateUserVerificationCode(userData.uid, verificationCode, verificationCodeExpiresAt, email);

        // 寄送新驗證碼
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'ArtBridge 電郵驗證碼',
            text: `您的驗證碼是：${verificationCode}，請於10分鐘內輸入驗證碼。`,
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "驗證碼已重新寄送" });
    } catch (error) {
        return res.status(500).json({ message: "伺服器錯誤" });
      }
}