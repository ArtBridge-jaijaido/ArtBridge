// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Firebase 配置
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 初始化 Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 初始化需要的 Firebase 服務
const auth = getAuth(app); 
const db = getFirestore(app); 
const storage = getStorage(app);   


if (process.env.NODE_ENV === "development") {
  auth.settings.appVerificationDisabledForTesting = true;
}



// 匯出 Firebase 服務
export { app, auth, db, storage, RecaptchaVerifier, signInWithPhoneNumber, signOut };
