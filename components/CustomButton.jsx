"use client";
import React from 'react'
import { notoSansTCClass } from '../app/layout.js';
import './css/CustomButton.css';

const CustomButton = ({title, onClick}) => {
  return (
    <div>

        <button className={`${notoSansTCClass} custom-button`} onClick={onClick}>
            {title}
        </button>

    </div>
  )
}

export default CustomButton
