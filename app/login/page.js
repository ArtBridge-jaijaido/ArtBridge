"use client"
import React from 'react'
import { notoSansTCClass } from "@/app/layout.js";
import { useNavigation } from "@/lib/functions";
import { useToast } from "@/app/contexts/ToastContext.js";
import Link from "next/link";
import "./login.css";
import styles from "../register/registerButton.module.css";
import CustomButton from "@/components/CustomButton/CustomButton.jsx";


const LoginPage = () => {



  const handleLogin = () =>{
    alert("user login in ")
  }

  return (
    <div className={`login-page ${notoSansTCClass}`}>
      <h1>LOGO</h1>
      <form className="login-form-container">
        
          <div className="login-form-group">
            <input
              type="email"
              placeholder="電子郵件"
            />
          </div>
          <div className="login-form-group">
            <input
              type="password"
              placeholder="密碼"
            />   
          </div>
          <div className="login-form-remember-me">
            <input
              type="checkbox"
              id="remember-me"
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
      <CustomButton title="登入" className={styles.registerArtistClientBtn} onClick={handleLogin} />
    </div>
  )
}

export default LoginPage
