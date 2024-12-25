"use client";
import React from 'react'
import { notoSansTCClass } from '../../app/layout.js';


const CustomButton = ({title, onClick, className = '' }) => {
  return (
    <div>

        <button className={`${notoSansTCClass} ${className}`} onClick={onClick}>
            {title}
        </button>

    </div>
  )
}

export default CustomButton
