"use client";
import React, { useState, useEffect } from "react";
import { notoSansTCClass } from "@/app/layout.js";
import { useSearchParams } from "next/navigation"; 
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
    <div className={`emailValidationPage ${notoSansTCClass}`}>
      <div className="emailValidationPage-container">
        <h2>LOGO</h2>
        <h2>已寄送驗證信件至 {email || "未提供電子郵件"}</h2>
        <input type="text" placeholder="請輸入驗證碼" />
        <h2>
          還沒收到?{" "}
          {isResendDisabled ? (
            <span> {counter} 秒後可重新發送</span>
          ) : (
            <span onClick={handleResendEmail}>重新發送</span>
          )}
        </h2>
        <CustomButton title="驗證" onClick={handleValidation} />
      </div>
    </div>
  );
};

export default EmailValidationPage;
