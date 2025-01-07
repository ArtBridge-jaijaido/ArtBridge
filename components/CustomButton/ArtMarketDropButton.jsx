"use client";
import React from "react";
import "./ArtMarketDropButton.css";

const ArtMarketDropdownButton = ({
  id,
  buttonText,
  options = [],
  isOpen,
  onToggleDropdown,
  onOptionSelect,
}) => {




  return (
    <div className="artMarketDropdown-menu-container">
      {/* 按鈕 */}
      <button
        id={id}
        className="artMarketDropdown-button"
        onClick={onToggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="artMarketDropdown-text">{buttonText}</span> 
        <span className="artMarketDropdown-arrow">▼</span>
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <ul className="artMarketDropdown-menu">
          {options.map((option, index) => (
            <li
              key={index}
              className="artMarketDropdown-menu-item"
              onClick={() => onOptionSelect(option)}
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



