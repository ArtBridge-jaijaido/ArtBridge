"use client"
import React, { useState } from 'react'
import { notoSansTCClass } from "@/app/layout.js";
import { useNavigation } from "@/lib/functions";
import { useToast } from "@/app/contexts/ToastContext.js";
import Link from "next/link";
import "./login.css";
import styles from "../register/registerButton.module.css";
import CustomButton from "@/components/CustomButton/CustomButton.jsx";
import {getUserData} from "@/services/userService.js";
import { useDispatch } from 'react-redux';
import { setUser } from '../../app/redux/feature/userSlice.js';
import { logoutUser } from "@/app/redux/feature/userSlice.js";
import { auth } from "@/lib/firebase.js";
import { setPersistence, signInWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';

const LoginPage = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  const { addToast } = useToast();
  const navigate = useNavigation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await setPersistence(auth, formData.rememberMe ? browserLocalPersistence : browserSessionPersistence); // 設定登入狀態
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const{success, data, message} = await getUserData(user.uid);
      const userEmail = user.email;


      if (!data?.isEmailCodeVerified) {
        addToast("error", message || "錯誤: 請先驗證您的電子郵件再登入");
        navigate(`/emailValidation?email=${userEmail}`);
        const response = await fetch("/api/resendCode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({email:userEmail }),
          });
          const result = await response.json();
          if (response.ok) {
            addToast("success", "驗證碼已重新寄送");
          } else {
            addToast("error", `驗證碼寄送失敗: ${result.message}`);
          }
        await auth.signOut();
        await fetch('/api/logout', { method: 'POST', credentials: 'include' });
        sessionStorage.clear();  // 清除sessionStorage
        dispatch(logoutUser()); 
        return;
      }



      const token = await user.getIdToken(); // 取得 ID Token
      
      if (!token) {
        addToast("error", "驗證失敗，請重新登入");
        return;
      }


      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // 🔹將 token 傳給後端
        },
        body: JSON.stringify({ rememberMe: formData.rememberMe }),
      });

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        dispatch(setUser(result.user));
        addToast("success", "成功:登入成功");

        setTimeout(() => {
          navigate("/artworkDashboard/painterDashboard");
        }, 2000);

      } else {
        addToast("error", "錯誤:登入失敗");
      }
    } catch (error) {
           
      if (error.code==="auth/invalid-credential"){
        
          addToast("error", "錯誤:登入失敗");
      }
      else{
       
          addToast("error", "錯誤: 登入失敗");
      }
    }
  };




  return (
    <div className={`login-page ${notoSansTCClass}`}>
      <h1>LOGO</h1>
      <form className="login-form-container">

        <div className="login-form-group">
          <input
            type="email"
            placeholder="電子郵件"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="login-form-group">
          <input
            type="password"
            placeholder="密碼"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="login-form-remember-me">
          <input
            type="checkbox"
            id="remember-me"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <span>記住我</span>
        </div>
      </form>
      <div className="login-form-bottom-part-container">
        <span className="login-highlight-blue">忘記密碼</span>
        <div className="login-notHasAccount">
          <span>還沒有帳號嗎?</span>
          <Link href="/register" className="login-highlight-blue"> 註冊</Link>
        </div>
      </div>
      <CustomButton 
        title="登入" 
        className={styles.registerArtistClientBtn} 
        onClick={handleSubmit} 
      />
    </div>
  )
}

export default LoginPage;
