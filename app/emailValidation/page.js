"use client";
import React, { useState, useEffect } from "react";
import { notoSansTCClass } from "@/app/layout.js";
import { useSearchParams } from "next/navigation"; 
import "./emailValidation.css";
import styles from "../register/registerButton.module.css";
import CustomButton from "@/components/CustomButton/CustomButton.jsx";

const EmailValidationPage = () => {
  const searchParams = useSearchParams(); 
  const email = searchParams.get("email"); 
  const [counter, setCounter] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true); 

  // 倒數計時邏輯
  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer); 
    } else {
      setIsResendDisabled(false); 
    }
  }, [counter]);

  const handleResendEmail = () => {
    console.log("Resend Email");
    setCounter(60); 
    setIsResendDisabled(true); 
  
  };

  const handleValidation = () => {
    console.log("Validation");
  
  };

  return (
    <div className={`emailValidation-Page ${notoSansTCClass}`}>
      <h1>LOGO</h1>
      <div className="emailValidation-Page-container">
        
        <h2>已寄送驗證信件至 <span className="emailValidation-highlight-blue">{email || "未提供電子郵件"}</span></h2>
        <div className="emailValidation-input-container"> 
            <input type="text" placeholder="請輸入驗證碼" />
        </div>
        <h3>
          還沒收到?{" "}
          {isResendDisabled ? (
            <span> {counter} 秒後可以<span className="emailValidation-highlight-blue">重新發送</span></span>
          ) : (
            <span onClick={handleResendEmail} className="emailValidation-highlight-blue emailValidation-highlight-resent">重新發送</span>
          )}
        </h3>
       
      </div>
      <CustomButton title="送出" className={styles.registerArtistClientBtn} onClick={handleValidation} />
    </div>
  );
};

export default EmailValidationPage;
