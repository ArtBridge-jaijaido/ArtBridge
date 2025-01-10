"use client";
import React from 'react'
import "./CustomIconButton.css";
import { notoSansTCClass } from '../../app/layout.js';





const CustomIconButton = ({ iconSrc,altText='', text, onClick, className = '' }) => {
  return (
    <button
      className={`CustomIconButton ${notoSansTCClass} ${className}`}
      onClick={onClick}
    >
     <img
        src={iconSrc}
        alt={altText}
        className="CustomIconButton-Icon"
      />
      <span className="CustomIconButton-text">{text}</span>
    </button>
  )
}

export default CustomIconButton
