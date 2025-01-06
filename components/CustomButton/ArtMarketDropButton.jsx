"use client";
import React, { useState } from "react";
import "./ArtMarketDropButton.css";

const ArtMarketDropdownButton = ({ buttonText, options = [], onOptionSelect = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(buttonText); // 初始按鈕文字

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option); // 更新按鈕文字
    onOptionSelect(option); // 執行回調函數
    setIsOpen(false); // 點擊後關閉菜單
  };

  return (
    <div className="artMarketDropdown-menu-container">
      {/* 按鈕 */}
      <button
        className="artMarketDropdown-button"
        onClick={toggleMenu}
        aria-expanded={isOpen} 
        aria-haspopup="true" 
      >
        {selectedOption} <span className="artMarketDropdown-arrow">▼</span>
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <ul className="artMarketDropdown-menu">
          {options.map((option, index) => (
            <li
              key={index}
              className="artMarketDropdown-menu-item"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArtMarketDropdownButton;

