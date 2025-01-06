"use client";
import React, { useState } from "react";
import { notoSansTCClass } from '../../app/layout.js';


const CustomButton = ({title, onClick, className = '',type = "button",styles}) => {
  const [isActive, setIsActive] = useState(false);

  const handleButtonClick = (event) => {
    setIsActive((prev) => !prev); // 切換選中狀態
    if (onClick) onClick(event); // 確保外部的 onClick 被執行
  };



  return (
    <div>
      <button
        className={`${notoSansTCClass} ${className} ${
          isActive && styles?.active ? styles.active : ""
        }`}
        onClick={handleButtonClick}
        type={type}
      >
        {title}
      </button>
    </div>
  );
}

export default CustomButton
