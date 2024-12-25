"use client";
import React from 'react'
import { notoSansTCClass } from '@/app/layout.js';
import Link from "next/link";
import CustomButton from '@/components/CustomButton/CustomButton.jsx';
import styles from "./registerButton.module.css";
import "./register.css"

const RegisterPage = () => {

 const handleClientRegister = () => {
    alert ("this is client");
 }

 const handleArtistRegister = () => {
    alert ("this is artist");
 }

 
 const handleUserRegister = () => {
    alert("user register");
    
 }

 



  return (
    <div className={`register-page ${notoSansTCClass}`}>
        <div className="register-top-part-container">
            <div className="register-logo">LOGO</div>
            <div className="register-ArtistClientButtons-container">
                <CustomButton title="繪師" className={styles.registerArtistClientBtn} onClick={ handleClientRegister}/>
                <CustomButton title="委託方" className={styles.registerArtistClientBtn} onClick={handleArtistRegister}/>
            </div>
        </div>

         {/* 單一個表單（左右兩欄） */}
      <form className="register-form-container">
        {/* 左欄：暱稱、真實姓名、Email、密碼、同意條款 */}
        <div className="register-form-column left-column">
          <div className="register-form-group">
            <input type="text" placeholder="暱稱 (至多 8 個字)" />
          </div>
          <div className="register-form-group">
            <input type="text" placeholder="真實姓名" />
          </div>
          <div className="register-form-group">
            <input type="email" placeholder="電子郵件" />
          </div>
          <div className="register-form-group">
          
            <input type="password" placeholder="密碼" />
          </div>
          <div className="register-form-agree">
            <input type="checkbox" id="agree" />
            <label>我已同意繪夢工坊<span>網站服務條款</span></label>
          </div>
        </div>

        {/* 右欄：手機號碼、身分證、身分證正面、身分證反面 */}
        <div className="register-form-column right-column">
          <div className="register-form-group">
            <input type="text" placeholder="手機號碼" />
          </div>
          <div className="register-form-group">
            <input type="text" placeholder="身分證 (對外顯示不會公開)" />
          </div>
          <div className="register-file-container">
            {/* 身分證正面 */}
            <label className="register-file-box">
                <span>身分證正面</span>
                {/* 真正的 input file 放在裡面，但用 hidden 來隱藏外觀 */}
                <input
                type="file"
                onChange={(e) => console.log("正面檔案：", e.target.files[0])}
                hidden
                />
            </label>

            {/* 身分證反面 */}
            <label className="register-file-box">
                <span>身分證反面</span>
                <input
                type="file"
                onChange={(e) => console.log("反面檔案：", e.target.files[0])}
                hidden
                />
            </label>
            </div>
            <div className="register-alreadyHasAccount">
                <span>已經有帳號？</span>
                <Link href="/login">登入</Link>
            </div>
        </div>
      </form>
      <CustomButton title="註冊" className={styles.registerArtistClientBtn} onClick={handleUserRegister}/>
    </div>
  )
}

export default RegisterPage
