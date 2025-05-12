import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import {  doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs} from "firebase/firestore";
import {generateUniqueSerial} from "@/services/userService.js";
import nodemailer from 'nodemailer'; 



export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Only POST method is allowed" });
        }

        const { email, password, nickname, realname, phone, role, gender, birthday, termsAccepted } = req.body;

      

        if (!email || !password || !nickname || !realname || !phone || !role || !gender || !birthday || termsAccepted !== true  ) {
            return res.status(400).json({ message: "Missing required fields" });
        }


        // 檢查 Firebase Authentication 中是否已經註冊過此電子郵件
        try {
            const userRef = collection(db, "users"); 
            const emailQuery = query(userRef, where("email", "==", email)); 
            const emailQuerySnapshot = await getDocs(emailQuery); 
        
            if (emailQuerySnapshot.docs.length > 0) {
                return res.status(400).json({ message: '該電子郵件已被註冊，請使用其他電子郵件' });
            }
        } catch (error) {
            console.error('Firestore query error:', error);
            return res.status(500).json({ message: 'Database query failed', error: error.message });
        }
        
        //  生成唯一專屬ID
        const uniqueSerialId = await generateUniqueSerial();
       
        
        // 創建新使用者
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;


      
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // 產生 6 位數驗證碼

        // 生日格式
        const formattedBirthday = birthday ? birthday.replace(/\//g, '-') : "0000-00-00";

        // default painter milestone
        const painterMilestone = [
            { label: "0% 支付款項", percent:0, id: 0 },
            { label: "20% 草稿", percent:20, id: 1 },
            { label: "30% 線稿", percent:30, id: 2 },
            { label: "60% 上色", percent:60, id: 3 },
            { label: "100% 完稿", percent:100, id: 4 }
          ]

        // 將用戶資料儲存到 Firestore
        const userDoc = doc(collection(db, "users"), userId);
        await setDoc(userDoc, {
            email,
            nickname,
            realname,
            phone,
            gender,
            birthday: formattedBirthday,
            role,
            verificationCode,
            userSerialId: uniqueSerialId,
            verificationCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 驗證碼 10 分鐘後過期
            createdAt: new Date(),
            isEmailCodeVerified: false,
            painterMilestone: painterMilestone
        });

        // 寄送驗證信件
        const transporter = nodemailer.createTransport({
            service: 'gmail',
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

        return res.status(200).json({ message: "註冊成功，驗證碼已寄出", userId });
    } catch (error) {
        console.error("Registration Error:", error);

        if (error.code === 'auth/email-already-in-use') {
            return res.status(400).json({ message: '該電子郵件已被註冊，請使用其他電子郵件' });
        }

        return res.status(500).json({ message: error.message });
    }
}
