import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import {  doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import nodemailer from 'nodemailer'; 
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() }); // 設定 multer 的 storage engine 為 memoryStorage

export const config = {
    api: {
        bodyParser: false, // 停用內建 bodyParser，因為我們要處理 multipart/form-data
    },
};

// 將 multer 包裝成 Promise
const multerPromise = (req, res) =>
    new Promise((resolve, reject) => {
        upload.fields([
            { name: 'frontImage', maxCount: 1 },
            { name: 'backImage', maxCount: 1 },
        ])(req, res, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Only POST method is allowed" });
        }

        await multerPromise(req, res);

        const { email, password, nickname, realname, phone, id, role } = req.body;
        const frontImage = req.files?.frontImage?.[0]; // 獲取身分證正面
        const backImage = req.files?.backImage?.[0]; // 獲取身分證反面

        if (!email || !password || !nickname || !frontImage || !backImage || !realname || !phone || !id || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 檢查照片格式 
        const allowedTypes = ['image/jpg','image/jpeg', 'image/png', 'image/heic', 'image/heif'];
        if (!allowedTypes.includes(frontImage.mimetype) || !allowedTypes.includes(backImage.mimetype)) {
            return res.status(400).json({ message: '照片格式不符合規範, 目前支援 jpg,jpeg,png,heic,heif' });
        }else if (frontImage.size > 5 * 1024 * 1024 || backImage.size > 5 * 1024 * 1024) {
            return res.status(400).json({ message: '照片大小不得超過 5MB' });
        }

        // 檢查 Firebase Authentication 中是否已經註冊過此電子郵件
        try {
            const userRef = collection(db, "users"); 
            const emailQuery = query(userRef, where("email", "==", email)); 
            const emailQuerySnapshot = await getDocs(emailQuery); 
        
            if (!emailQuerySnapshot.empty) {
                return res.status(400).json({ message: '該電子郵件已被註冊，請使用其他電子郵件' });
            }
        } catch (error) {
            console.error('Firestore query error:', error);
            return res.status(500).json({ message: 'Database query failed', error: error.message });
        }
        
        // 創建新使用者
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        
        // 上傳圖片到 Firebase Storage
        const storage = getStorage();

        const frontImageRef = ref(storage, `usersIdImage/${userId}/IdFrontImage.jpg`);
        await uploadBytes(frontImageRef, frontImage.buffer);
        const frontImageUrl = await getDownloadURL(frontImageRef);

        const backImageRef = ref(storage, `usersIdImage/${userId}/IdBackImage.jpg`);
        await uploadBytes(backImageRef, backImage.buffer);
        const backImageUrl = await getDownloadURL(backImageRef);

      
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // 產生 6 位數驗證碼

        // 將用戶資料儲存到 Firestore
        const userDoc = doc(collection(db, "users"), userId);
        await setDoc(userDoc, {
            email,
            nickname,
            realname,
            phone,
            id,
            role,
            verificationCode,
            frontImageUrl,
            backImageUrl,
            verificationCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 驗證碼 10 分鐘後過期
            createdAt: new Date(),
            isEmailCodeVerified: false,
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
