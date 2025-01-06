"use client";
import React from 'react'
import "./CustomIconButton.css";
import { notoSansTCClass } from '../../app/layout.js';
import Image from 'next/image';




const CustomIconButton = ({ iconSrc,altText='', text, onClick, className = '' }) => {
  return (
    <button
      className={`CustomIconButton ${notoSansTCClass} ${className}`}
      onClick={onClick}
    >
     <Image
        src={iconSrc}
        alt={altText}
        layout="intrinsic" // "fill" | "fixed" | "intrinsic" | "responsive"
        width={35}
        height={35}
        className="CustomIconButton-Icon"
      />
      <span className="CustomIconButton-text">{text}</span>
    </button>
  )
}

export default CustomIconButton
